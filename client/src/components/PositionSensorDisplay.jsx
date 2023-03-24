import React from 'react'
import "./PositionSensorDisplay.css";

function PositionSensorDisplay(props) {

    function convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        h += d * 24;
        return "Hours: " + h + " Minutes: " + m + " Seconds: " + s;
    }

    let temp = 0;
    let latState = "";
    let lastTime = "";
    let elementholder = []
  return (
    <div>
        <div>
            {props["datatype"].map((movement, index)=>{
                if (movement == "out" ){
                    if (latState == "out"){
                        lastTime = props["x"][index];
                        elementholder.push(<h3>Time Taken : Unknown</h3>)
                        let t = elementholder;
                        elementholder = [];
                        elementholder.push(<div> 
                            <h3>Outgoing : {props["x"][index]}</h3>
                        </div>);
                        console.log(elementholder);
                        return <div className='data_picker'>{t}</div>;
                    }
                    latState = "out";
                    lastTime = props["x"][index];
                    console.log(elementholder);
                    elementholder.push(<div> 
                        <h3>Outgoing : {props["x"][index]}</h3>
                    </div>);
                }else if (movement == "in"){
                    var timeDifference = "Unknown"
                    if (latState == "out"){
                        timeDifference = new Date(props["x"][index]) - new Date(lastTime);
                        latState = "in";
                        elementholder.push(<>
                        <h3>Incoming : {props["x"][index]}</h3>
                        <h3>Time Taken : { timeDifference =="Unknown" ? timeDifference : convertMS(timeDifference)}</h3>
                        </>); 
                        let t = elementholder;
                        elementholder = []
                        return <div className='data_picker'>{t}</div>;
                    }else{
                        elementholder.push(<div> 
                            <h3>Incoming : {props["x"][index]}</h3>
                        </div>);
                        elementholder.push(<h3>Time Taken : Unknown</h3>);
                        let t = elementholder;
                        latState = "in";
                        elementholder = [];
                        return <div className='data_picker'>{t}</div>;
                    }
                    
                }
            })}
        </div>
        <div className='countsContainer'>
        <h1 className='counts'>Total Outgoing : {props['datatype'].filter(x=> x=="out").length}</h1>
        <h1 className='counts'>Total Incoming : {props['datatype'].filter(x=> x=="in").length}</h1>
        </div>
    </div>
  )
}

export default PositionSensorDisplay;