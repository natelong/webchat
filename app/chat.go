package chat

import(
	"fmt"
	"math/rand"
)

const ADD_CONNECTION = "addConnection"
const REMOVE_CONNECTION = "removeConnection"

func UUID() ( uuid string ) {
	return fmt.Sprintf( "%v-%v-%v-%v-%v", getRandomQuad(), getRandomQuad(), getRandomQuad(), getRandomQuad(), getRandomQuad() )
}

func getRandomQuad() ( quad string ) {
	return fmt.Sprintf( "%d%d%d%d", rand.Intn( 9 ), rand.Intn( 9 ), rand.Intn( 9 ), rand.Intn( 9 ) )
}

func StartStream(){
	
}

func NewMessage(){
	
}