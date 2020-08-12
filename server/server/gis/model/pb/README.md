# Protocol Buffers

View: https://developers.google.com/protocol-buffers

Golang: https://developers.google.com/protocol-buffers/docs/gotutorial

## Usage

1. If you haven't installed the compiler, download the package from: 

```
https://github.com/protocolbuffers/protobuf/releases/tag/v3.12.4
```

2. Run the following command to install the Go protocol buffers plugin:

```
go install google.golang.org/protobuf/cmd/protoc-gen-go
```

The compiler plugin protoc-gen-go will be installed in $GOBIN, defaulting to $GOPATH/bin. It must be in your $PATH for the protocol compiler protoc to find it.

3. Now run the compiler, specifying the source directory (where your application's source code lives – the current directory is used if you don't provide a value), the destination directory (where you want the generated code to go; often the same as $SRC_DIR), and the path to your .proto. In this case, you would invoke:

```
protoc -I=$SRC_DIR --go_out=$DST_DIR $SRC_DIR/addressbook.proto
```

Because you want Go code, you use the --go_out option – similar options are provided for other supported languages.
