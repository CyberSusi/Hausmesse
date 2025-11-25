interface UserBase {
    username: string;
    email: string;
}

export interface UserListModel extends UserBase {
    id: string;
    isAdmin: boolean;
}

export interface UserCreateForm extends UserBase{
    password: string
}