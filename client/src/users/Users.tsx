import axios from "axios";
import React, {useEffect, useState} from "react";
import ReactTable from "react-table";
import ConfirmDialog from "../common/ConfirmDialog";
import AddEditUserModal from "./AddEditUserModal";
import {addUser, deleteUser, updateUser} from "./user.actions";
import styles from "./user.module.css";

export default function Users(props) {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await axios.get("http://localhost:5000/api/user");
                setUserData(result.data);
                setLoading(false);
            } catch (err) {
                props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
            }
        };
        fetchData();
    }, []);

    const updateUserData = user => {
        try {
            setUserData(() => {
                const data = userData.map(o => {
                    if (user.id === o.id) {
                        return user;
                    }
                    return o;
                });
                return data;
            });
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }

    const updateNewUserData = user => {
        try {
            setUserData([...userData, user]);
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }

    const deleteUserRow = async (user) => {
        try {
            const deletedUser = await deleteUser(user.id);
            setUserData(() => userData.filter(o => o.id !== deletedUser.id));
        } catch (err) {
            props.triggerErrorToast(err.response && err.response.data && err.response.data.message || err);
        }
    }

    return (
        <div>
            <div className={styles.headerContainer}>
                <h1 className={styles.headerText}>Users</h1>
                <div className={styles.headerButton}>
                    <AddEditUserModal
                        user={{}}
                        mode={"add"}
                        triggerErrorToast={props.triggerErrorToast}
                        submitRequest={addUser}
                        updateUserData={updateNewUserData}
                    />
                </div>
            </div>
            <ReactTable
                style={{maxWidth: "1200px", margin: "0 auto"}}
                columns={[
                    {
                        Header: "Id",
                        accessor: "id",
                        width: 50,
                    },
                    {
                        Header: "First Name",
                        accessor: "firstName",
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName",
                    },
                    {
                        Header: "Email",
                        accessor: "email",
                    },
                    {
                        Header: "Number",
                        accessor: "phoneNumber",
                    },
                    {
                        Header: "Court",
                        accessor: "court",
                    },
                    {
                        Header: "Is Admin",
                        id: "isAdmin",
                        width: 75,
                        accessor: o => o.isAdmin.toString(),
                    },
                    {
                        Header: "Actions",
                        Cell: ({row}) => (
                            <div className={styles.actionsContainer}>
                                <AddEditUserModal
                                    user={row._original}
                                    mode={"edit"}
                                    triggerErrorToast={props.triggerErrorToast}
                                    submitRequest={updateUser}
                                    updateUserData={updateUserData}
                                />
                                {props.user.id !== row.id &&
                                <ConfirmDialog
                                  title={"Delete user?"}
                                  message={"This user will be delete, user data will be lost. Continue?"}
                                  buttonText={"Delete"}
                                  buttonVariant={"danger"}
                                  callback={deleteUserRow.bind(null, row._original)}
                                />}
                            </div>
                        ),
                    },
                ]}
                data={userData}
                loading={loading}
                filterable
                defaultPageSize={20}
                className="-striped -highlight"
            />
            <br/>
        </div>
    );
}
