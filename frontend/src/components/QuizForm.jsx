import React, {useState} from 'react'


export default function QuizForm({onGenerate}){
const [topic, setTopic] = useState('')
return (
<form onSubmit={(e)=>{e.preventDefault(); onGenerate(topic)}} className="p-4 border rounded">
<label className="block mb-2">Topic</label>
<input value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="e.g. Binary Trees" className="w-full p-2 border rounded"/>
<button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Generate</button>
</form>
)
}