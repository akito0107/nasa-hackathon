package main

import (
    "fmt"
	"net/http"
    "os"
    "flag"
    "strconv"
	"./handlers"
)

/* ----------------------- */
/* --- main                */
/* ----------------------- */
func main() {
    // switch
    var (portNum int)
	var (redisHost string)
    flag.IntVar(&portNum, "p", 3002, "int flag")
	flag.StringVar(&redisHost, "redis", "192.168.99.100:6379", "string flag")
    flag.Parse()

    var port string
    port = ":"+strconv.Itoa(portNum)
    fmt.Println("listen port =", port)

    // route handler
    http.HandleFunc("/search", handlers.SearchHandler)
    http.HandleFunc("/game", handlers.GamingHandler(redisHost))

    // do serve
    err := http.ListenAndServe(port, nil)

    // error abort
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
}

