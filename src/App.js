import React, { useEffect, useRef, useState } from 'react'
import { URL } from './config'
import axios from 'axios'
export default function App() {
    const [a, seta] = useState([])
    const [b, setb] = useState([])
    const [loading, setloading] = useState(false)

    const insert = src => {
        axios.post(URL + ".json", { src })
            .then(res => res.data)
            .then(d => {
                console.log("upload done", d.name)
                seta([...a, { id: d.name, src }])
            })
            .catch(d => console.log("upload cancelled", d))
            .finally(d => {
                console.log("finally executed")
                setloading(false)
            })
    }

    const handleChange = async e => {
        setloading(true)
        let temp = []
        for (let i = 0; i < e.target.files.length; i++) {
            let r = await createImage(e.target.files[i], i)
        }
    }

    const createImage = (file, index) => {
        let fr = new FileReader()
        fr.onload = () => insert(fr.result)
        if (file) {
            return fr.readAsDataURL(file)
        }
    }


    const loadPhotos = () => {
        axios.get(URL + ".json")
            .then(res => res.data)
            .then(d => {
                // console.log(d)
                let temp = []
                let x = Object.keys(d)
                let y = Object.values(d)
                for (let i = 0; i < x.length; i++) {
                    temp.push({ id: x[i], ...y[i] })
                }
                seta(temp)
            })
            .catch(e => console.log("err loading :: ", e))
    }
    useEffect(loadPhotos, [])

    return (
        <div>
            <h1>new upload</h1>
            <input type="file" multiple={true} onChange={handleChange} />
            <h2>{loading ? "uploading.." : ""}</h2>
            <h1>all images {a?.length || 0} </h1>
            {a?.map((x, i) => <img key={i} width={100} src={x.src} />)}
        </div>
    )
}
