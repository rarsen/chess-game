import './Chessboard.css';
import Tile from '../tile/Tile'; 
import React, { useEffect, useRef, useState } from 'react';

import {X,Y,gridSize} from "../../Constants";
import { Piece, Position } from '../../models';




interface Props{
    playMove:(piece: Piece, position: Position)=> boolean;
    pieces: Piece[];
}
export default function Chessboard({playMove,pieces}:Props){
    const [activePiece,setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition,setgrabPosition]= useState<Position>(new Position(-1,-1));
    const chessboardRef = useRef<HTMLDivElement>(null);
    
    function grabPiece(e:React.MouseEvent){

        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft )/gridSize);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop- 800)/gridSize));
            setgrabPosition(new Position(grabX,grabY));
            const x = e.clientX - gridSize/2;
            const y = e.clientY - gridSize/2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard){
            const minX = chessboard.offsetLeft - 25 ;
            const minY =chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth-75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight-75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";


            if (x<minX) {
                activePiece.style.left = `${minX}px`;
            }else if (x>maxX) {
                activePiece.style.left = `${maxX}px`;
            }else{
                activePiece.style.left = `${x}px`;
            }

            if (y<minY) {
                activePiece.style.top = `${minY}px`;
            }else if (y>maxY) {
                activePiece.style.top = `${maxY}px`;
            }else{
                activePiece.style.top = `${y}px`;
            }
        }
    }
    function dropPiece(e: React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const x  = Math.floor((e.clientX - chessboard.offsetLeft )/gridSize);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop- 800)/gridSize));
        
            const currentPiece = pieces.find(p=> p.samePosition(grabPosition));

            if (currentPiece) {
                var success = playMove(currentPiece.clone(), new Position(x,y));
                if (!success) {
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
            setActivePiece(null);
        }
    }

    
    
    let board = [];

    for (let j = Y.length-1; j >= 0; j--) {
        for (let i = 0; i < X.length; i++) {
            const number = j+i+2;
            const piece = pieces.find(p=> p.samePosition(new Position(i,j)));
            let image = piece ? piece.image : '';
                    
            let currentPiece = activePiece!= null ? pieces.find(p=>p.samePosition(grabPosition)): undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece?.possibleMoves?.some(p=>p.samePosition(new Position(i,j))) :false;

            board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight = {highlight}/>)
              
        }
    }

    return (
        <>
            
            <div  
            onMouseMove={(e) => movePiece(e)} 
            onMouseDown={(e)=>grabPiece(e)} 
            onMouseUp={(e)=>dropPiece(e)}
            id="chessboard"
            ref = {chessboardRef}
            >
                {board}
            </div>
        </>
    );
}