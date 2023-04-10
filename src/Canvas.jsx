import React, { useRef, useState, useEffect } from "react";
import "./canvas.css";

import { FaEraser } from 'react-icons/fa';
import {GrClearOption} from 'react-icons/gr';     
import{BsFillPencilFill} from 'react-icons/bs'; 
import{fabric}  from 'fabric';




export default function Canvas() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3B3B3B");
  const [size, setSize] = useState("3");
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const timeout = useRef(null);
  const [cursor, setCursor] = useState("default");
  
  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");

    //Resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    //Load from locastorage
    const canvasimg = localStorage.getItem("canvasimg");
    if (canvasimg) {
      var image = new Image();
      ctx.current = canvas.getContext("2d");
      image.onload = function () {
        ctx.current.drawImage(image, 0, 0);
        setIsDrawing(false);
      };
      image.src = canvasimg;
    }

  }, [ctx]);

  const startPosition = ({ nativeEvent }) => {
    setIsDrawing(true);
    draw(nativeEvent);
  };

  const finishedPosition = () => {
    setIsDrawing(false);
    ctx.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    ctx.current.lineWidth = size;
    ctx.current.lineCap = "round";
    ctx.current.strokeStyle = color;

    ctx.current.lineTo(nativeEvent.clientX, nativeEvent.clientY);
    ctx.current.stroke();
    ctx.current.beginPath();
    ctx.current.moveTo(nativeEvent.clientX, nativeEvent.clientY);

    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      var base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
  };

    const clearCanvas = () => {
    localStorage.removeItem("canvasimg");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Passing clear screen
    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      var base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
  };

  const getPen = () => {
    setCursor("default");
    setSize("3");
    setColor("#3B3B3B");
  };
  const eraseCanvas = () => {
    setCursor("grab");
    setSize("20");
    setColor("white");

    if (!isDrawing) {
      return;
    }

  }
    const createRectangle=()=>{
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // set the fill color of the rectangle
    ctx.fillStyle = 'red';

    // draw a rectangle with a top-left corner at (500, 500) and a width and height of 250,300
    ctx.fillRect(500, 300, 250, 300);
   
  }
  
const createTriangle =()=>{
  const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // set the canvas dimensions
    canvas.width = 3000;
    canvas.height = 3000;

    // draw the triangle
    context.beginPath();
    context.moveTo(150, 50);
    context.lineTo(750, 250);
    context.lineTo(250, 650);
    context.closePath();
    context.stroke();
  }


    
  
  
  
  
  return (
   <>

<div class="icon-bar">

      <div className="canvas-btn">
      <div class="tooltip">
      <button class="btn" onClick={getPen} className="btn-width">
      <BsFillPencilFill/>
     
        </button> <span class="tooltiptext">Pencil</span> </div>
        <br></br>
        <div className="btn-width">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <select
            className="btn-width"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option> 1 </option>
            <option> 3 </option>
            <option> 5 </option>
            <option> 10 </option>
            <option> 15 </option>
            <option> 20 </option>
            <option> 25 </option>
            <option> 30 </option>
          </select>
        </div>
    
        
        <button onClick={createRectangle}className="btn-width">rectangle</button><br></br><br></br>
        <button onClick={createTriangle}className="btn-width">triangle</button><br></br><br></br>
        <div class="tooltip">
        <button  class="btn" onClick={clearCanvas} className="btn-width">
           <GrClearOption/>
        </button>
        <span class="tooltiptext">Clear</span></div>
        <br></br> <br></br>
        <div class="tooltip">
          <button class="btn"  onClick={eraseCanvas} className="btn-width">
            <FaEraser/>
          </button>
          <span class="tooltiptext">Eraser</span>
        </div>   
        </div>   
        </div>                                                     
      <canvas
       style={{ cursor: cursor }}
        onMouseDown={startPosition}
        onMouseUp={finishedPosition}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
}