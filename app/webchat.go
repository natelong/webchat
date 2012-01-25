package main

import(
	"net/http"
	"log"
	"websocket"
)

type subscription struct {
	conn		*websocket.Conn
	subscribe	bool
}

type message struct {
	conn 		*websocket.Conn
	text		[]byte
}

var messageChan = make( chan message )
var subscriptionChan = make( chan subscription )
var conns = make( map[*websocket.Conn]int )

func main(){
	go pubHub()
	go subHub()

	http.HandleFunc( "/favicon.ico", favicon )
	http.HandleFunc( "/js/", serveStaticFile )
	http.HandleFunc( "/css/", serveStaticFile )
	http.HandleFunc( "/", serveIndex )

	http.Handle( "/event", websocket.Handler( doEventStream ) )

	err := http.ListenAndServe( ":8080", nil )
	if err != nil {
		log.Fatal( "ListenAndServe: %s", err )
	}
}

func Publish( message []byte, connection *websocket.Conn ){
	for conn, _ := range conns{
		if conn != connection {
			if _, err := conn.Write( message ); err != nil {
				conn.Close()
			}
		}
	}
}

func pubHub(){
	for{
		message := <- messageChan
		Publish( message.text, message.conn )
	}
}

func subHub(){
	for{
		subscription := <- subscriptionChan

		if subscription.subscribe {
			conns[ subscription.conn ] = 1
		}else{
			delete( conns, subscription.conn )
		}
	}
}

func doEventStream( ws *websocket.Conn ){
	defer func(){
		subscriptionChan <- subscription{ ws, false }
		ws.Close()
	}()

	subscriptionChan <- subscription{ ws, true }

	for{
		buf := make( []byte, 512 )

		n, err := ws.Read( buf )
		if err != nil {
			log.Println( "Error reading from websocket connection" )
			break;
		}

		messageChan <- message{
			ws,
			buf[ 0:n ],
		}
	}
}

func serveStaticFile( res http.ResponseWriter, req *http.Request ){
	log.Println( "Serving static file ", req.URL.Path )
	http.ServeFile( res, req, "www" + req.URL.Path )
}

func serveIndex( res http.ResponseWriter, req *http.Request ){
	log.Println( "Serving index file for request ", req.URL.Path )
	http.ServeFile( res, req, "www/index.html" )
}

func favicon( res http.ResponseWriter, req *http.Request ){
	log.Println( "Serving favicon" )
	res.WriteHeader( 204 );
}
