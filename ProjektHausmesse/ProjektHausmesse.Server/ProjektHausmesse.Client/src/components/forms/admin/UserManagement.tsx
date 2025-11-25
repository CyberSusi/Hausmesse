import {useEffect, useState} from "react";
import {UserCreateForm, UserListModel} from "@/models/dto/User.ts";
import {UserService} from "@/api/userService.ts";
import {Check, Edit, ToggleLeft, ToggleRight, Trash, X} from "lucide-react";
import {AuthService} from "@/api/authService.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";

// 1: List view, 2: Add User, 3: Edit User
enum ActionState {
    List,
    Add,
    Edit,
}

export function UserManagement() {
    const [userList, setUserList] = useState<UserListModel[]>([]);
    const [currentEditUser, setCurrentEditUser] = useState<UserListModel | null>(null);
    const [actionState, setActionState] = useState<ActionState>(ActionState.List);
    const [error, setError] = useState<boolean>(false);
    const form = useForm<UserCreateForm>();

    const reset = () => {
        form.reset({
            username: "",
            email: "",
            password: "",
        });
    }

    const deleteUser = async (user: UserListModel) => {
        if (confirm("Benutzer " + user.username + " wirklich unwiderruflich löschen?")) {
            const res = await UserService.deleteUser(user.id);
            if (!res) {
                alert("Fehler beim Löschen");
            }
            getUsers();
        }
    }

    const getUsers = async () => {
        const data = await UserService.getUsers();
        setUserList(data);
    }

    const submit = async (values: UserCreateForm) => {
        const result = actionState == ActionState.Add
            ? await UserService.addUser(values)
            : await UserService.updateUser(currentEditUser!.id, values);

        if (result) {
            getUsers();
            setActionState(ActionState.List);
            reset();
        } else if (!result) {
            setError(true);
        } else {
            alert("Ein Fehler ist aufgetreten")
        }
    }

    const toggleAdmin = async (id: string, value: boolean) => {
        const toggled = await UserService.toggleAdmin(id, value);
        if (toggled) {
            getUsers();
        } else {
            alert("Ein Fehler ist aufgetreten")
        }
    }

    const adminToggleElement = (user: UserListModel) => {
        return user.isAdmin ?
            <td className={"px-6 py-4 text-green-500"}>
                <div onClick={() => toggleAdmin(user.id, false)}>
                    <ToggleRight></ToggleRight>
                </div>
            </td>
            :
            <td className={"px-6 py-4 text-red-600"}>
                <div onClick={() => toggleAdmin(user.id, true)}>
                    <ToggleLeft></ToggleLeft>
                </div>
            </td>
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <>
            {actionState == ActionState.List && (
                <div className="my-3">
                    <Button onClick={() => setActionState(ActionState.Add)}>Benutzer hinzufügen</Button>
                </div>
            )}
            {actionState != ActionState.List && (
                <div className="my-3">
                    <Button onClick={() => {
                        setActionState(ActionState.List);
                        setCurrentEditUser(null);
                        setError(false);
                        reset();
                    }}>Liste anzeigen</Button>
                </div>
            )}
            {actionState == ActionState.List && (
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Benutzername
                            </th>
                            <th scope="col" className="px-6 py-3">
                                E-Mail
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Admin
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Aktionen
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {userList.map(user => <tr
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.username}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            {adminToggleElement(user)}
                            <td className="px-6 py-4">
                                <div className="flex flex-row gap-3">
                                    <div className="text-blue-500" title="Bearbeiten"
                                         onClick={() => {
                                             setActionState(ActionState.Edit);
                                             setCurrentEditUser(user);
                                             form.reset({...user});
                                         }}>
                                        <Edit></Edit>
                                    </div>
                                    <div className="text-red-600" title="Löschen" onClick={() => deleteUser(user)}>
                                        <Trash></Trash>
                                    </div>
                                </div>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            )}
            {(actionState == ActionState.Add || actionState == ActionState.Edit) && (
                <form onSubmit={form.handleSubmit(submit)}>
                    <div className="grid place-items-center">
                        <div className="">
                            <div className="mb-2">
                                <label
                                    htmlFor="username"
                                    className={`block font-bold text-sm mb-2`}
                                >
                                    Benutzername
                                </label>
                                <Input
                                    {...form.register("username", {required: true})}
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="containerfreakX"
                                />
                            </div>

                            <div className="mb-2">
                                <label
                                    htmlFor="email"
                                    className={`block font-bold text-sm mb-2`}
                                >
                                    Email
                                </label>
                                <Input
                                    {...form.register("email", {required: true})}
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="containerfreakX@container.de"
                                />
                            </div>

                            <div className="mb-8">
                                <label
                                    htmlFor="password"
                                    className={`block font-bold text-sm mb-2`}>
                                    Passwort
                                </label>
                                <Input
                                    {...form.register("password", {required: true})}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="BananaJuice.0049"
                                />
                            </div>

                            <Button size="lg" className="rounded-full text-sm sm:text-base grow-1" type="submit">
                                {actionState == ActionState.Add ? "Benutzer erstellen" : "Speichern"}
                            </Button>

                            {error && (<div
                                className="mt-3 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                                role="alert">
                                <span
                                    className="font-medium">Fehler beim {actionState == ActionState.Add ? "Erstellen" : "Speichern"}
                            </span>
                            </div>)}
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}
