import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../ultil/api";


const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            console.log(">>> check res: ", res)
            if (!res?.message) {
                setDataSource(res)
            }else{
                notification.error({
                    message: "Unauthorized", 
                    description: res.message
                })
            }
        }
        fetchUser();
    }, [])



    const columns = [

        {
            title: 'ID',
            dataIndex: '_id',

        },

        {
            title: 'Email',
            dataIndex: 'email',

        },
        {
            title: 'Name',
            dataIndex: 'name',

        },

        {
            title: 'Role',
            dataIndex: 'role',

        },
    ];



    return (
        <div style={{ padding: 30 }}>
            <Table dataSource={dataSource} columns={columns}
                rowKey={"_id"}
            />

        </div>
    )
}

export default UserPage;