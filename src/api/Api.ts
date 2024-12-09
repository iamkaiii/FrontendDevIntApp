/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsMeals {
  id?: number;
  image_url?: string;
  meal_brand?: string;
  meal_detail?: string;
  meal_info?: string;
  meal_weight?: string;
  status?: boolean;
}

export interface DsMilkRequests {
  address?: string;
  creator?: DsUsers;
  creator_id?: number;
  date_create?: string;
  date_finish?: string;
  date_update?: string;
  delivery_date?: string;
  id?: number;
  moderator?: DsUsers;
  moderator_id?: number;
  recipient_name?: string;
  recipient_surname?: string;
  status?: number;
}

export interface DsUsers {
  id?: number;
  is_moderator?: boolean;
  login?: string;
  password?: string;
}

export interface SchemasAddMealToMilkReqResponse {
  mealID?: number;
  messageResponse?: string;
  milkRequestID?: number;
}

export interface SchemasChangePassword {
  new_password?: string;
  old_password?: string;
}

export interface SchemasCreateMealRequest {
  image_url?: string;
  meal_brand?: string;
  meal_detail?: string;
  meal_info?: string;
  meal_weight?: string;
  status?: boolean;
}

export interface SchemasCreateMealResponse {
  id?: number;
  messageResponse?: string;
}

export interface SchemasDeleteMealFromMilkReqRequest {
  meal_id?: number;
}

export interface SchemasDeleteMealResponse {
  id?: number;
  messageResponse?: string;
}

export interface SchemasGetAllMealsResponse {
  count?: number;
  meals?: DsMeals[];
  milk_req_ID?: number;
}

export interface SchemasGetAllMilkRequestsWithParamsResponse {
  milkRequests?: DsMilkRequests[];
}

export interface SchemasGetMealResponse {
  meal?: DsMeals;
}

export interface SchemasLoginUserRequest {
  login?: string;
  password?: string;
}

export interface SchemasLogoutUserRequest {
  login?: string;
}

export interface SchemasRegisterUserRequest {
  login?: string;
  password?: string;
}

export type SchemasResponseMessage = object;

export interface SchemasUpdateAmountMilkReqMealRequest {
  amount?: number;
  meal_id?: number;
}

export interface SchemasUpdateMealRequest {
  image_url?: string;
  meal_brand?: string;
  meal_detail?: string;
  meal_info?: string;
  meal_weight?: string;
  status?: boolean;
}

export interface SchemasUpdateMealResponse {
  id?: number;
  messageResponse?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Change the password of the authenticated user
     *
     * @tags users
     * @name ChangeUserInfoUpdate
     * @summary Change user password
     * @request PUT:/api/change_user_info
     * @secure
     */
    changeUserInfoUpdate: (body: SchemasChangePassword, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/change_user_info`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates a user and returns a JWT token.
     *
     * @tags users
     * @name LoginUserCreate
     * @summary Login a user
     * @request POST:/api/login_user
     */
    loginUserCreate: (body: SchemasLoginUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/login_user`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Log out the user by blacklisting the token
     *
     * @tags users
     * @name LogoutCreate
     * @summary Logout
     * @request POST:/api/logout
     */
    logoutCreate: (body: SchemasLogoutUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/logout`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create meal with properties
     *
     * @tags meals
     * @name MealCreate
     * @summary Create meal
     * @request POST:/api/meal
     * @secure
     */
    mealCreate: (body: SchemasCreateMealRequest, params: RequestParams = {}) =>
      this.request<SchemasCreateMealResponse, SchemasResponseMessage>({
        path: `/api/meal`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete meal using it's ID
     *
     * @tags meals
     * @name MealDelete
     * @summary Delete meal by ID
     * @request DELETE:/api/meal/{ID}
     * @secure
     */
    mealDelete: (id: string, params: RequestParams = {}) =>
      this.request<SchemasDeleteMealResponse, SchemasResponseMessage>({
        path: `/api/meal/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get info about meal using its ID
     *
     * @tags meals
     * @name MealDetail
     * @summary Get meal by ID
     * @request GET:/api/meal/{ID}
     * @secure
     */
    mealDetail: (id: string, params: RequestParams = {}) =>
      this.request<SchemasGetMealResponse, SchemasResponseMessage>({
        path: `/api/meal/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update meal using it's ID with parametres
     *
     * @tags meals
     * @name MealUpdate
     * @summary Update meal by ID
     * @request PUT:/api/meal/{ID}
     * @secure
     */
    mealUpdate: (id: string, body: SchemasUpdateMealRequest, params: RequestParams = {}) =>
      this.request<SchemasUpdateMealResponse, SchemasResponseMessage>({
        path: `/api/meal/${id}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete meal using it's ID
     *
     * @tags meals
     * @name MealChangePicCreate
     * @summary Change picture By ID
     * @request POST:/api/meal/change_pic/{ID}
     * @secure
     */
    mealChangePicCreate: (
      id: string,
      data: {
        /** File */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SchemasResponseMessage, any>({
        path: `/api/meal/change_pic/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description This endpoint allows you to add a meal to a milk request by it's ID.
     *
     * @tags meals
     * @name MealToMilkRequestCreate
     * @summary Add meal to milk request
     * @request POST:/api/meal_to_milk_request/{ID}
     * @secure
     */
    mealToMilkRequestCreate: (id: string, params: RequestParams = {}) =>
      this.request<SchemasAddMealToMilkReqResponse, SchemasResponseMessage>({
        path: `/api/meal_to_milk_request/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a list of all meals.
     *
     * @tags meals
     * @name MealsList
     * @summary Get all meals
     * @request GET:/api/meals
     * @secure
     */
    mealsList: (params: RequestParams = {}) =>
      this.request<SchemasGetAllMealsResponse, SchemasResponseMessage>({
        path: `/api/meals`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет блюдо из запроса на молоко по ID запроса и MealID
     *
     * @tags meals_and_requests
     * @name MilkReqMealsDelete
     * @summary Удалить блюдо из запроса на молоко
     * @request DELETE:/api/milk_req_meals/{ID}
     * @secure
     */
    milkReqMealsDelete: (id: string, body: SchemasDeleteMealFromMilkReqRequest, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/milk_req_meals/${id}`,
        method: "DELETE",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет количество продукта в конкретной заявке
     *
     * @tags meals_and_requests
     * @name MilkReqMealsUpdate
     * @summary Обновить количество продуктов в заявке
     * @request PUT:/api/milk_req_meals/{ID}
     */
    milkReqMealsUpdate: (id: string, body: SchemasUpdateAmountMilkReqMealRequest, params: RequestParams = {}) =>
      this.request<string, SchemasResponseMessage>({
        path: `/api/milk_req_meals/${id}`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получить список запросов на молоко с возможностью фильтрации по статусу и датам
     *
     * @tags milk_requests
     * @name MilkRequestsList
     * @summary Получить все заявки на молочную кухню с параметрами
     * @request GET:/api/milk_requests
     * @secure
     */
    milkRequestsList: (
      query?: {
        /** Статус заявки */
        status?: string;
        /** Наличие статуса */
        is_status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SchemasGetAllMilkRequestsWithParamsResponse, SchemasResponseMessage>({
        path: `/api/milk_requests`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new user.
     *
     * @tags users
     * @name RegisterUserCreate
     * @summary Register a new user
     * @request POST:/api/register_user
     */
    registerUserCreate: (body: SchemasRegisterUserRequest, params: RequestParams = {}) =>
      this.request<SchemasResponseMessage, SchemasResponseMessage>({
        path: `/api/register_user`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
