import {useEffect, useState} from "react";
import io, {Socket} from 'socket.io-client';
import {Button, Divider, Input, message, Upload} from "antd";
import {PiDotFill} from "react-icons/pi";
import {SendOutlined, UploadOutlined} from "@ant-design/icons";
import SocketClient from "./core/base/socketClient.ts";
import EmojiPicker from "emoji-picker-react";
import {FaRegSmile} from "react-icons/fa";
type DataUser = {sockerId: string, ipAddress: string}

function App() {
    const [totalUser, setTotalUser] = useState(0)
    const [listIpAddress, setListIpAddress] = useState([])
    const [data, setData] = useState([])
    // const [socket, setSocket] = useStat<Socket<>>(null)
    const [input, setInput] = useState("")
    const [openEmoj, setOpenEmoj] = useState(false)
    const [emojClick, setEmojClick] = useState([])
  useEffect(() => {
      SocketClient.getSocket().on("updateTotalUser", args => {
          setTotalUser(args)
      })
      SocketClient.getSocket().on("updateInfoUser", args => {
          // message.success("Thành viên mới")
          setListIpAddress(Object.values(args))
      })
      SocketClient.getSocket().on("sendDataServer", (ip, content) => {
          setData(prevState => [...prevState, {ip: ip, mess: content}])
      })
      SocketClient.getSocket().on("sendFileServer", args => {
          console.log(args)
      })
  }, []);
    const submitMess = () => {
        SocketClient.getSocket().emit("sendDataClient", input)
        setInput("")
    }
  return (
    <div className={"w-full h-screen flex justify-center items-center"}>
      <div className={"lg:w-4/5 mx-auto bg-slate-500 h-4/5 rounded-2xl border-white bg-opacity-40 p-8 grid grid-cols-4 shadow-2xl overflow-hidden"}>
          <div className={"h-full w-full border rounded-tl-2xl rounded-tr-none border-r-0 rounded-bl-2xl p-2"}>
              
          </div>
          <div className={"col-span-2 w-full h-full flex flex-col justify-between border gap-5"}>
              <div className={"w-full h-[80px] flex flex-col pl-10 py-3"}>
                  <span className={"text-[20px]"}>Phòng chat 1</span>
                  <span>
                      Có {totalUser} đang hoạt động
                  </span>
              </div>
              <Divider className={"bg-white"} />
              <div className={"w-full border-3  overflow-y-auto px-10 flex flex-col gap-5 h-[300px]"}>
                  {!!data && data.map((value, index) => {
                      return <div key={index} className={"flex flex-row justify-start items-center gap-3"}>
                          <span className={"font-semibold border p-1 rounded-md shadow-2xl"}>{value.ip}</span>:
                          <span className={"bg-slate-400 p-1 rounded-md bg-opacity-50 px-2"}>{value.mess}</span>
                      </div>
                  })}
                  
              </div>
              
              
              <div className={"w-full h-[60px] flex flex-row justify-center items-center gap-5 p-2 relative"}>
                  <Button onClick={() => setOpenEmoj(prevState => !prevState)} size={"large"} icon={<FaRegSmile size={25} color={"green"} />} />
                  {openEmoj && <div className={'absolute z-50 -translate-y-2/3 -translate-x-full'}>
                      <EmojiPicker onEmojiClick={(emoji) => {
                          setInput(prevState => prevState + emoji.emoji)
                      }} />
                  </div>}
                  <Upload
                        onChange={e => {
                            SocketClient.getSocket().emit("sendFile", e.file.name, e.file)
                            console.log(e)
                        }}
                        showUploadList={false}
                        beforeUpload={() => false}
                  ><Button icon={<UploadOutlined />} /></Upload>
                  <Input onPressEnter={submitMess} value={input} onChange={e => setInput(e.target.value)} suffix={(<Button onClick={submitMess} icon={<SendOutlined size={30} />} />)} size={"large"} rootClassName={""} />
              </div>
              
          </div>
          <div className={"border p-2"}>
              <span className={"font-semibold text-blue-600 w-full"}>Đang hoạt động trong kênh</span>
              <div className={"p-5 flex flex-col"}>
                  {!!listIpAddress && listIpAddress.map((value, index) => {
                      return <span key={index} className={"flex flex-row justify-start gap-2 items-center"}><PiDotFill size={30} color={"blue"} /> {value}</span>
                  })}
              </div>
          </div>
          
      </div>
    </div>
  )
}

export default App
