export interface IGenericResponse {
  status: string;
  message: string;
}

export interface ICenters {
  center_id: string;
  address: {
    city: string;
    country: string;
  };
  referer_center_id: string;
  level: string;
  purchases: number;
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

export interface ICenterSettings {
  meeting_rooms: number;
  meeting_duration: number;
  workstations: number;
  workstation_duration: number;
  operating_hours: { day: string; start: string; end: string }[];
  manager_membership_amount: number;
  manager_membership_type: string;
  manager_aicenter_amount: number;
  manager_aicenter_type: string;
  salesrep_membership_amount: number;
  salesrep_membership_type: string;
  salesrep_aicenter_amount: number;
  salesrep_aicenter_type: string;
  instructor_membership_amount: number;
  instructor_membership_type: string;
  instructor_aicenter_amount: number;
  instructor_aicenter_type: string;
}

export interface IAddress {
  street: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface IClient {
  _id: string;
  center_id: string;
  sales_rep_referal_link: string;
  name: string;
  title: string;
  mobile: string;
  email: string;
  company: string;
  website: string;
  address: IAddress;
  business_activity: string;
  check_annual: boolean;
  check_ai_center: boolean;
  check_international: boolean;
  createdAt: Date;
  updatedAt: Date;
}
