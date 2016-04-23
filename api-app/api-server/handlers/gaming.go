package handlers

import (
    "fmt"
	"net/http"
    "encoding/json"
    "io"
    "bufio"
	"github.com/garyburd/redigo/redis"
)

/* --- JSON define */
type JsonResponse struct {
    Status int
    Code string
    Result []string
}

type JsonBody struct {
    Token string
    Sentence string
}

type MessageBody struct {
	Id string
}

func publish(message *MessageBody, redisHost string) {
	fmt.Println("Pub to")
	go func() {
		c, err := redis.Dial("tcp", redisHost)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer c.Close()

		b, jsonErr := json.Marshal(*message)
		if jsonErr != nil {
			fmt.Println(jsonErr)
			return
		}
		fmt.Println(string(b))
		c.Do("PUBLISH", "game_channel", string(b))
		c.Flush()
	}()
}

func GamingHandler(redisHost string) func (http.ResponseWriter, *http.Request){
	return func(w http.ResponseWriter, r *http.Request) {
	    list := make([]string,0)
	    ret := JsonResponse{0,"OK",list}
	    request := ""
	    // JSON return
	    defer func() {
	        // result
	        outjson,err := json.Marshal(ret)
	        if err != nil {
	            fmt.Println(err)
	        }
	        w.Header().Set("Content-Type", "application/json")
	        fmt.Fprint(w, string(outjson))
	    }()
	    // type check
	    if r.Method != "POST" {
	        ret.Status = 1
	        ret.Code = "Not POST method"
	        return
	    }
	    // request body
	    rb := bufio.NewReader(r.Body)
	    for {
	        s, err := rb.ReadString('\n')
	        request = request + s
	        if err == io.EOF { break }
	    }
	    // JSON parse
	    var dec JsonBody
	    b := []byte(request)
	    err := json.Unmarshal(b, &dec)
	    if err != nil {
	        ret.Status = 2
	        ret.Code = "JSON parse error."
	        return
	    }
		mes := &MessageBody{Id: "Hello"}
		publish(mes, redisHost)
	}
}
