import React, { useEffect, useState } from 'react'
import { URL } from './config'
import axios from 'axios'
export default function App() {
    const [ob1, setob1] = useState({
        name: "",
        email: ""
    })

    const [ob2, setob2] = useState({
        id: "",
        name: "",
        email: ""
    })

    const [a, seta] = useState([])


    const insert = () => {
        // insert logic
        axios.post(URL + ".json", ob1)
            .then(res => res.data)
            .then(d => {
                // console.log("after insert", d.name)
                let id = d.name
                seta([...a, { ...ob1, id }])
            })
            .catch(e => console.log("after insert err", e))
    }


    const update = () => {
        // update logic
        let { name, email, id } = ob2
        axios.patch(URL + "/" + id + ".json", { name, email })
            .then(res => res.data)
            .then(d => {
                console.log("success::after update resp ", d)
                seta(a.map(x => x.id === ob2.id ? ob2 : x))
            })
            .catch(d => {
                console.log("failed::after update resp ", d)
            })

    }



    const edit = x => setob2(x)
    const del = x => {
        // delete logic here 
        axios.delete(URL + "/" + x.id + ".json")
            .then(res => res.data)
            .then(d => {
                console.log("after del success resp ", d)
                seta(a.filter(item => item.id !== x.id))
            })
            .catch(d => console.log("after del failed resp ", d))
    }

    const loadUsers = () => {
        axios.get(URL + ".json")
            .then(res => res.data)
            .then(d => d)
            .then(d => {
                // console.log(d)
                if (d !== null) {
                    let temp = []
                    let x = Object.keys(d)//all ids ["234234DSASD123","ASDAS2213"]
                    let y = Object.values(d)//all [{name,email},{name,email}]
                    // [ {id,name,emial} , {id,name,email} ]
                    for (let i = 0; i < x.length; i++) {
                        temp.push({ id: x[i], ...y[i] })
                    }
                    seta(temp)
                }
            })
            .catch(e => {
                console.log("err in loading users from firebase", e)
            })
    }

    useEffect(loadUsers, [])
    return (
        <div>
            <div>
                <h1>insert</h1>
                <input value={ob1.name} name='name' onChange={e => setob1({ ...ob1, name: e.target.value })} />
                <input value={ob1.email} name='email' onChange={e => setob1({ ...ob1, email: e.target.value })} />
                <button onClick={insert}>insert</button>
            </div>

            {true && <div>
                <h1>update ?</h1>
                <input value={ob2.name} name='name' onChange={e => setob2({ ...ob2, name: e.target.value })} />
                <input value={ob2.email} name='email' onChange={e => setob2({ ...ob2, email: e.target.value })} />
                <button onClick={update}>update</button>
            </div>
            }
            <h1>all data {a?.length || 0}</h1>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>email</th>
                        <th>actions</th>
                    </tr>
                </thead>

                <tbody>
                    {a?.map((x, i) => <tr key={i}>
                        <td>{x.id}</td>
                        <td>{x.name}</td>
                        <td>{x.email}</td>
                        <td>
                            <button onClick={() => edit(x)}>edit</button>
                            <button onClick={() => del(x)}>del</button>
                        </td>
                    </tr>)}
                </tbody>

            </table>
        </div>
    )
}
