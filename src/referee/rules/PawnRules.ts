
import { Piece, Position } from "../../models";
import { Pawn } from "../../models/Pawn";
import { TeamType } from "../../Types";
import { tileIsOccupied, tileIsOccupiedByOpp } from "./GeneralRules";

export const pawnMove = (initialPosition:Position ,desiredPosition:Position,team:TeamType,boardState:Piece[] ):boolean => {
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;
 
    if (initialPosition.x === desiredPosition.x &&initialPosition.y === specialRow && desiredPosition.y - initialPosition.y===2*pawnDirection) {
        if (!tileIsOccupied(desiredPosition,boardState) && !tileIsOccupied(new Position(desiredPosition.x,desiredPosition.y-pawnDirection),boardState)) {
            return true;
        }
    }else if(initialPosition.x === desiredPosition.x&& desiredPosition.y - initialPosition.y === pawnDirection){
        if (!tileIsOccupied(desiredPosition,boardState)) {
            return true;
        }
    }
    else if(desiredPosition.x-initialPosition.x===-1 && desiredPosition.y - initialPosition.y === pawnDirection){
        if(tileIsOccupiedByOpp(desiredPosition,boardState,team)){
            return true;
        }
    }else if(desiredPosition.x-initialPosition.x===1 && desiredPosition.y - initialPosition.y === pawnDirection){
        if(tileIsOccupiedByOpp(desiredPosition,boardState,team)){
            return true;
        }
    }
    return false;


}

export const getPossiblePawnMoves = (pawn:Piece, boardState:Piece[]): Position[] =>{
    const possibleMoves: Position[]=[];

    const specialRow = (pawn.team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (pawn.team === TeamType.OUR) ? 1 : -1;

    const normalMove = new Position(pawn.position.x,pawn.position.y+pawnDirection);
    const specialMove = new Position(normalMove.x,normalMove.y+pawnDirection);
    const upperLeftAttack = new Position(pawn.position.x-1,pawn.position.y+pawnDirection);
    const upperRightAt = new Position(pawn.position.x+1,pawn.position.y+pawnDirection);
    const leftPos= new Position(pawn.position.x-1,pawn.position.y);
    const rightPos = new Position(pawn.position.x+1,pawn.position.y);


    if (!tileIsOccupied(normalMove,boardState)) 
    {
        possibleMoves.push(new Position(pawn.position.x,pawn.position.y+pawnDirection));
        if (pawn.position.y===specialRow && !tileIsOccupied(specialMove,boardState)) {
            possibleMoves.push(specialMove);
        }
    }
    if (tileIsOccupiedByOpp(upperLeftAttack,boardState,pawn.team)) {
        possibleMoves.push(upperLeftAttack);
    }else if (!tileIsOccupied(upperLeftAttack,boardState)) {
        const leftPiece  = boardState.find(p=>p.samePosition(leftPos));
        if (leftPiece!= null && (leftPiece as Pawn).enPassant) {
            possibleMoves.push(upperLeftAttack);
        }
    }
    if (tileIsOccupiedByOpp(upperRightAt,boardState,pawn.team)) {
        possibleMoves.push(upperRightAt);
    }else if (!tileIsOccupied(upperRightAt,boardState)) {
        const rightPiece  = boardState.find(p=>p.samePosition(rightPos));
        if (rightPiece != null && (rightPiece as Pawn).enPassant) {
            possibleMoves.push(upperRightAt);
        }
    }

    return possibleMoves;
}