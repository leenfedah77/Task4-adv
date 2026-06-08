export interface Input {
  name: string;
  placeholder: string;
  type: string;
  value?: string;
}

export type ItemCreated = Omit<
  Item,
  "created_at" | "id" | "updated_at" | "image_url"
> & {
  image: Blob;
};

export interface loginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  profile_image: Blob | null;
}

export interface Item {
  created_at: string;
  updated_at: string;
  id: number;
  image_url: string;
  name: string;
  price: string;
}