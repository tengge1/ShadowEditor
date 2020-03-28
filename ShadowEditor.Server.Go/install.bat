go env -w GO111MODULE=on

go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/

go get -u -v github.com/uudashr/gopkgs/cmd/gopkgs

go env -w GOPROXY=https://goproxy.cn

go get -u golang.org/x/tools/cmd/guru
go get -u golang.org/x/tools/cmd/gorename
go get -u golang.org/x/tools/cmd/goimports
go get -u golang.org/x/lint/golint
go get -u golang.org/x/tools/cmd/godoc

go get -u -v github.com/acroca/go-symbols
go get -u -v github.com/cweill/gotests/...
go get -u -v github.com/fatih/gomodifytags
go get -u -v github.com/josharian/impl
go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct
go get -u -v github.com/haya14busa/goplay/cmd/goplay
go get -u -v github.com/godoctor/godoctor
go get -u -v github.com/go-delve/delve/cmd/dlv
go get -u -v github.com/nsf/gocode
go get -u -v github.com/zmb3/gogetdoc
go get -u -v github.com/rogpeppe/godef
go get -u -v github.com/ramya-rao-a/go-outline
go get -u -v github.com/sqs/goreturns
go get -u -v github.com/tylerb/gotype-live
go get -u -v github.com/sourcegraph/go-langserver
go get -u -v github.com/stamblerre/gocode

go get -u -v github.com/spf13/cobra
go get -u -v github.com/spf13/viper
go get -u -v github.com/mitchellh/go-homedir
go get -u -v go.mongodb.org/mongo-driver/mongo
go get -u -v github.com/dimfeld/httptreemux
go get -u -v github.com/elazarl/go-bindata-assetfs