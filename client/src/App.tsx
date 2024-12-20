import {useEffect, useState} from "react";
import io, {Socket} from 'socket.io-client';
import {Button, Divider, Input, message, Upload} from "antd";
import {PiDotFill} from "react-icons/pi";
import {SendOutlined, UploadOutlined} from "@ant-design/icons";
import SocketClient from "./core/base/socketClient.ts";
import EmojiPicker from "emoji-picker-react";
import {FaRegSmile} from "react-icons/fa";
import axios from "axios";
type DataUser = {sockerId: string, ipAddress: string}

function App() {
    const [totalUser, setTotalUser] = useState(0)
    const [listIpAddress, setListIpAddress] = useState([])
    const [data, setData] = useState([])
    
    // const [socket, setSocket] = useStat<Socket<>>(null)
    const [input, setInput] = useState("")
    const [openEmoj, setOpenEmoj] = useState(false)
  useEffect(() => {
      
      
      SocketClient.getSocket().on("updateTotalUser", args => {
          setTotalUser(args)
      })
      SocketClient.getSocket().on("updateInfoUser", args => {
          setListIpAddress(Object.keys(args))
      })
      SocketClient.getSocket().on("sendDataServer", (ip, content) => {
          setData(prevState => [...prevState, {ip: ip, mess: content}])
      })
      SocketClient.getSocket().on("sendFileServer", (ip, file) => {
          setData(prevState => [...prevState, {ip: ip, mess: <a download className={"underline"} target="_blank" href={`https://server-giy5.onrender.com/download/${file}`}>{file}</a> }])
      })
    
      
      
  }, []);
    
    useEffect(() => {
        
        
    }, []);
    
    const submitMess = () => {
        SocketClient.getSocket().emit("sendDataClient", input)
        setInput("")
    }
  return (
    <div className={"w-full h-screen flex justify-center items-center overflow-hidden"}>
      <div className={"shadow-2xl lg:w-4/5 mx-auto bg-slate-500 h-4/5 rounded-2xl border-white bg-opacity-40 p-8 grid md:grid-cols-4 grid-cols-1 overflow-hidden"}>
          <div className={"col-span-3 w-full h-full flex flex-col justify-between border gap-5"}>
              <div className={"w-full h-[80px] flex flex-col pl-10 py-3"}>
                  <span className={"text-[20px]"}>Phòng chat 1</span>
                  <span>
                      Có {totalUser} đang hoạt động
                  </span>
              </div>
              <Divider className={"bg-white"} />
              <div className={"w-full border-3  overflow-y-auto px-10 flex flex-col gap-5 md:h-[300px] h-[200px]"}>
                  {!!data && data.map((value, index) => {
                      return <div key={index} className={"flex flex-row justify-start items-center gap-3"}>
                          <span className={"font-semibold border p-1 rounded-md shadow-2xl"}>{value.ip}</span>:
                          <span className={"bg-slate-400 p-1 rounded-md bg-opacity-50 px-2"}>{value.mess}</span>
                      </div>
                  })}
                  
              </div>
              
              
              <div className={"w-full h-[60px] flex flex-row justify-center items-center gap-5 p-2 relative"}>
                  <Button onClick={() => setOpenEmoj(prevState => !prevState)} size={"large"} icon={<FaRegSmile size={25} color={"green"} />} />
                  {openEmoj && <div className={'absolute z-50 lg:-translate-y-2/3 lg:-translate-x-full -translate-y-0 -translate-x-0'}>
                      <EmojiPicker onEmojiClick={(emoji) => {
                          setInput(prevState => prevState + emoji.emoji)
                      }} />
                  </div>}
                  <Upload
                        onChange={e => {
                            SocketClient.getSocket().emit("sendFile", e.file.name, e.file)
                        }}
                        showUploadList={false}
                        beforeUpload={() => false}
                  ><Button icon={<UploadOutlined />} /></Upload>
                  <Input onPressEnter={submitMess} value={input} onChange={e => setInput(e.target.value)} suffix={(<Button onClick={submitMess} icon={<SendOutlined size={30} />} />)} size={"large"} rootClassName={""} />
              </div>
              
          </div>
          <div className={"border p-2 h-full overflow-hidden md:block hidden"}>
              <span className={"font-semibold text-blue-600 w-full"}>Đang hoạt động trong kênh</span>
              <div className={"p-5 flex flex-col overflow-y-auto h-full"}>
                  {!!listIpAddress && listIpAddress.map((value, index) => {
                      return <span key={index} className={"flex flex-row justify-start gap-2 items-center text-sm"}><PiDotFill size={30} color={"blue"} /> {value}</span>
                  })}
              </div>
          </div>
          
      </div>
    </div>
  )
}

export default App
