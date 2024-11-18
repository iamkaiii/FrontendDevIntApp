export interface MilkProducts {

    id : number
    meal_info : string
    meal_weight : string
    meal_brand: string
    meal_detail: string
    image_url ?: string
    status : boolean

}

export interface ApiResponse {
    MilkProducts: MilkProducts[];
}