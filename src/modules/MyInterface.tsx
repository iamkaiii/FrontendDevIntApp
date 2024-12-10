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

export interface ApiResponseGetAllProds{
    MilkProducts: MilkProducts[];
    MilkRequestID: number;
    MealsInDraftCount: number;
}

export interface User {
    id: number;
    login: string;
    password: string;
    is_moderator: boolean;
}

export interface MilkRequest {
    id: number;
    status: number;
    date_create: string;
    date_update: string;
    date_finish: string;
    creator_id: number;
    moderator_id?: number | null;
    recipient_name?: string;
    recipient_surname?: string;
    address?: string;
    delivery_date: string;
    Creator: User;
    Moderator: User;
}

export interface MilkRequestResponse {
    MilkRequest: MilkRequest;
    count: number;
    MilkRequesMeals: MilkProducts[];
}

