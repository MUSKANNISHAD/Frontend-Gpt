import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response=await fetch(`http://ec2-13-51-241-12.eu-north-1.compute.amazonaws.com:8080/api/thread`);
           const res = await response.json();

          if (Array.isArray(res)) {
     const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
     setAllThreads(filteredData);
    } else {
    console.error("Expected an array but got:", res);
    setAllThreads([]); // or handle it another way
       }


           
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {

            const response=await fetch(`http://ec2-13-51-241-12.eu-north-1.compute.amazonaws.com:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response=await fetch(`http://ec2-13-51-241-12.eu-north-1.compute.amazonaws.com:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
              <i className="fa-brands fa-openai Smile"></i>
                {/* <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img> */}
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By <b>Muskan_Nishad</b> &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;