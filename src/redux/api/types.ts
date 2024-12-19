export interface IGenericResponse {
  status: string;
  message: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  center_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetmeResponse {
  status: string;
  user: IUser;
}

export interface IChatbotItem {
  _id: string;
  scenario: string;
  image: string;
  slug: string;
}

export interface IChatbotInfo {
  _id: string;
  scenario: string;
  image: string;
  person_details: string[];
}

export interface IChatRequest {
  slug: string;
  msg: { type: string; text: string }[];
  tts_required: boolean;
  name: string;
  count: number;
  concern: string;
  person_details: string[];
}
