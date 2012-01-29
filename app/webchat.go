package main

import(
	"net/http"
	"log"
	"websocket"
	"encoding/json"
	"./app/bin/chat"
)

type Subscription struct {
	Connection	*websocket.Conn
	Subscribe	string
	User 		*User
}

type User struct {
	ID 			string
	Channels	[]string
	Name 		string
}

type MessageData struct{
	Type 		string
	Data 		map [ string ] interface{}
}

type message struct {
	Connection	*websocket.Conn
	Body 		MessageData
}

var messageChan = make( chan message )
var subscriptionChan = make( chan *Subscription )
var subscriptions = make( map[ string ]*Subscription )

func main(){
	go pubHub()
	go subHub()

	http.HandleFunc( "/favicon.ico", favicon )
	http.HandleFunc( "/js/", serveStaticFile )
	http.HandleFunc( "/css/", serveStaticFile )
	http.HandleFunc( "/img/", serveStaticFile )
	http.HandleFunc( "/", serveIndex )

	http.Handle( "/chat", websocket.Handler( doEventStream ) )

	err := http.ListenAndServe( ":8080", nil )
	if err != nil {
		log.Fatal( "ListenAndServe: %s", err )
	}
}

func Broadcast( newMessage MessageData ){
	messageObj, _ := json.Marshal( newMessage )

	for _, sub := range subscriptions{
		_, err := sub.Connection.Write( messageObj )
		if err != nil {
			sub.Connection.Close()
		}
	}
}

// this is dangerous right now. Anyone can update anyone's name, etc
func AcknowledgeStart( message MessageData ){
	ID, _ := message.Data[ "ID" ].( string )
	Name, _ := message.Data[ "Name" ].( string )
	//Channels, _ := message.Data[ "Channels" ].( []string )

	subscriptions[ ID ].User.Name = Name

	SendUserList()
}

func SendUserList(){
	message := new( MessageData )
	message.Type = "userList"
	message.Data = make( map[string]interface{} )
	
	count := 0
	users := make( []string, len( subscriptions ) )
	for _, sub := range subscriptions {
		if sub.User.Name == "" {
			continue
		}
		users[ count ] = sub.User.Name
		count += 1
	}

	message.Data[ "Users" ] = users[ 0:count ]
	Broadcast( *message )
}

func doEventStream( ws *websocket.Conn ){
	ID := chat.UUID()
	defer func(){
		subscriptionChan <- &Subscription{ ws, chat.REMOVE_CONNECTION, &User{ ID, nil, "" } }
		ws.Close()
	}()

	subscriptionChan <- &Subscription{ ws, chat.ADD_CONNECTION, &User{ ID, nil, "" } }
	newStartMessage, _ :=  json.Marshal(
		MessageData{
			"start",
			map[string]interface{}{
				"ID": ID,
			} } )

	ws.Write( newStartMessage )

	for{
		buf := make( []byte, 1024 )

		n, err := ws.Read( buf )
		if err != nil {
			log.Println( "Error reading from websocket connection: ", err.Error() )
			break;
		}

		newMessageData := new( MessageData )
		err = json.Unmarshal( buf[ 0:n ], newMessageData )

		if err != nil {
			log.Println( "Error unmarshaling message: ", string( buf[ 0:n ] ), " : ", err.Error() )
		}

		messageChan <- message{
			ws,
			*newMessageData,
		}
	}
}

func pubHub(){
	for{
		message := <- messageChan
		switch message.Body.Type {
			case "acknowledgeStart":
				log.Println( "Acknowledging connection start" )
				AcknowledgeStart( message.Body )
			case "message":
				log.Println( "New Message" )
				Broadcast( message.Body )
			case "getUserList":
				log.Println( "GetUserList" )
				SendUserList();
		}
	}
}

func subHub(){
	for{
		sub := <- subscriptionChan
		if sub.Subscribe == chat.ADD_CONNECTION {
			subscriptions[ sub.User.ID ] = sub
		}else{
			delete( subscriptions, sub.User.ID )
			SendUserList()
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
