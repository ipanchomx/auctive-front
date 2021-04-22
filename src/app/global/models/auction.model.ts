export interface Auction {
    auction_id: String,
    buy_now_price: number,
    category: String,
    description: String,
    end_date: String,
    owner_email: String,
    owner_name?: String,
    product_img_urls: Array<String>,
    start_date: String,
    starting_price: number,
    auction_status?: String,
    status?: String,
    tags: Array<String>,
    title: String,
    bid_winner?: String,
    current_bidder?: String,
    current_price?: number,
}