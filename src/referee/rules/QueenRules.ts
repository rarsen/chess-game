
import { Piece,Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpp, tileIsOccupied, tileIsOccupiedByOpp } from "./GeneralRules";

export const queenMove = (initialPosition:Position ,desiredPosition:Position,team:TeamType,boardState:Piece[] ):boolean => {
    for(let i = 1; i < 8; i++){

        let multiplierX = (desiredPosition.x<initialPosition.x) ? -1 : (desiredPosition.x>initialPosition.x) ? 1 : 0;
        let multiplierY = (desiredPosition.y<initialPosition.y) ? -1 : (desiredPosition.y>initialPosition.y) ? 1 : 0;
        
        let passedPosition=new Position(initialPosition.x+(i*multiplierX), initialPosition.y+(i*multiplierY));

        if (passedPosition.samePosition(desiredPosition)) {
            if (tileIsEmptyOrOccupiedByOpp(passedPosition,boardState,team)) {
                return true;
            }
        }else{
            if (tileIsOccupied(passedPosition,boardState)) {
                break;
            }
        }   
    }
    return false;
}

export const getPossibleQueenMoves = (queen: Piece, boardState: Piece[]): Position[] =>{
    const possibleMoves: Position[] = [];
    for(let i = 1; i<8; i++){
        const destination = new Position(queen.position.x, queen.position.y+i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8; i++){
        const destination =new Position(queen.position.x, queen.position.y-i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8; i++){
        const destination=new Position(queen.position.x-i, queen.position.y);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8; i++){
        const destination=new Position(queen.position.x+i, queen.position.y);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(queen.position.x+i, queen.position.y+i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(queen.position.x+i, queen.position.y-i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(queen.position.x-i, queen.position.y-i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(queen.position.x-i, queen.position.y+i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,queen.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    return possibleMoves;
}