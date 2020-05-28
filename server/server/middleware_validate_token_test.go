package server

import (
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/server/system"
)

func TestValidateTokenMiddleware(t *testing.T) {
	// read config
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
	// test handler
	hello := "Hello, world!"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}

	notAllowed := `{"Code":301,"Msg":"Not allowed."}`

	// 1. Authority is not enabled.
	Config.Authority.Enabled = false
	checkAuthority(t, handler, hello, "")

	// 2. Path is not registered.
	Config.Authority.Enabled = true
	checkAuthority(t, handler, notAllowed, "")

	// 3. Authority is `None`.
	apiAuthorities["/"] = None
	checkAuthority(t, handler, hello, "")

	// 4. User has no authority.
	apiAuthorities["/"] = SaveScene
	checkAuthority(t, handler, notAllowed, "")

	// 5. User has the specific authority.
	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}
	// add test role and user
	roleID := primitive.NewObjectID()
	role := bson.M{
		"ID":     roleID,
		"Status": 0,
	}
	if _, err := mong.InsertOne(RoleCollectionName, role); err != nil {
		t.Error(err)
	}
	userID := primitive.NewObjectID()
	user := bson.M{
		"ID":     userID,
		"RoleID": roleID.Hex(),
		"Status": 0,
	}
	if _, err := mong.InsertOne(UserCollectionName, user); err != nil {
		t.Error(err)
	}
	// user has the authority
	apiAuthorities["/"] = SaveScene
	auth := bson.M{
		"RoleID":      roleID.Hex(),
		"AuthorityID": SaveScene,
	}
	if _, err := mong.InsertOne(OperatingAuthorityCollectionName, auth); err != nil {
		t.Error(err)
	}
	token := getToken(userID.Hex(), t)
	checkAuthority(t, handler, hello, token)
	// user has no authority
	filter := bson.M{
		"RoleID": roleID.Hex(),
	}
	if _, err := mong.DeleteOne(OperatingAuthorityCollectionName, filter); err != nil {
		t.Error(err)
	}
	checkAuthority(t, handler, notAllowed, "")
	// delete user and role
	filter = bson.M{
		"ID": roleID,
	}
	if _, err := mong.DeleteOne(RoleCollectionName, filter); err != nil {
		t.Error(err)
	}
	filter = bson.M{
		"ID": userID,
	}
	if _, err := mong.DeleteOne(UserCollectionName, filter); err != nil {
		t.Error(err)
	}
}

func getToken(userID string, t *testing.T) string {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(1)).Unix()
	claims["iat"] = time.Now().Unix()
	claims["userID"] = userID
	token.Claims = claims

	tokenString, err := token.SignedString([]byte(Config.Authority.SecretKey))
	if err != nil {
		t.Error(err)
	}
	return tokenString
}

func checkAuthority(t *testing.T, handler http.HandlerFunc, expect, token string) {
	// test server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ValidateTokenMiddleware(w, r, handler)
	}))
	defer ts.Close()
	// get response
	client := http.Client{}
	if token != "" {
		cookies := []*http.Cookie{
			&http.Cookie{Name: "token", Value: token},
		}
		jar, err := cookiejar.New(nil)
		if err != nil {
			t.Error(err)
		}
		ur, err := url.Parse(ts.URL)
		if err != nil {
			t.Error(err)
		}
		jar.SetCookies(ur, cookies)
		client.Jar = jar
	}
	resp, err := client.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}
	defer resp.Body.Close()
	byts, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Error(err)
	}
	str := string(byts)
	if str != expect {
		t.Errorf("expect %v, got %v", expect, str)
	}
}

func TestCanInitialize(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}
	_, err = mong.ListCollectionNames()
	if err != nil {
		t.Error(err)
	}
	// save old config
	oldInitialized := false
	config := system.Config{}
	find, err := mong.FindOne(ConfigCollectionName, bson.M{}, &config)
	if err != nil {
		t.Error(err)
	}
	if find {
		oldInitialized = config.Initialized
	}
	// set Initialized to false
	if find {
		update := bson.M{
			"$set": bson.M{
				"Initialized": false,
			},
		}
		if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
			t.Error(err)
		}
	} else {
		config.Initialized = false
		if _, err = mong.InsertOne(ConfigCollectionName, config); err != nil {
			t.Error(err)
		}
	}
	if canInitialize() != true {
		t.Errorf("expect true, got false")
	}
	// set Initialized to true
	update := bson.M{
		"$set": bson.M{
			"Initialized": true,
		},
	}
	if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
		t.Error(err)
	}
	if canInitialize() != false {
		t.Errorf("expect false, got true")
	}
	// restore initial record
	if find {
		update := bson.M{
			"$set": bson.M{
				"Initialized": oldInitialized,
			},
		}
		if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
			t.Error(err)
		}
	} else {
		if _, err = mong.DeleteAll(ConfigCollectionName); err != nil {
			t.Error(err)
		}
	}
}

func TestLogAPI(t *testing.T) {
	// read config
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
	// set a temp file as log file
	file, err := ioutil.TempFile(os.TempDir(), "*.txt")
	if err != nil {
		t.Error(err)
	}
	defer file.Close()
	Logger.SetOutput(file)
	// write logs
	logAPI("/foo", SaveScene, "hello", true)
	logAPI("/foo/bar", None, "", false)
	// read logs
	bytes, err := ioutil.ReadFile(file.Name())
	if err != nil {
		t.Error(err)
	}
	lines := strings.Split(string(bytes), "\n")
	if len(lines) == 0 {
		t.Errorf("expect greater than 0, got 0")
	}
	line0 := "/foo SAVE_SCENE hello Success"
	if !strings.Contains(lines[0], line0) {
		t.Errorf("%v is not find in line 0", line0)
	}
	line1 := "/foo/bar NONE guest Fail"
	if !strings.Contains(lines[1], "") {
		t.Errorf("%v is not find in line 1", line1)
	}
}
