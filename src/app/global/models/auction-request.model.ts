export interface AuctionRequest {
    images: ImageRequest[],
    buy_now_price : number,
    category : string,
    description : string,
    starting_price : number,
    tags : string[],
    title : string,
    duration : number,
}

export interface ImageRequest {
    mime: string,
    image: string
}