
import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpp, tileIsOccupied, tileIsOccupiedByOpp } from "./GeneralRules";

export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {

    if (initialPosition.x === desiredPosition.x) {

        for (let i = 1; i < 8; i++) {
            let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
            let passedPosition = new Position(initialPosition.x, initialPosition.y + (i * multiplier));
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }
    }
    if (initialPosition.y === desiredPosition.y) {

        for (let i = 1; i < 8; i++) {
            let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;

            let passedPosition = new Position(initialPosition.x + (i * multiplier), initialPosition.y);
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if (tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }
    }
    return false;

}

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = [];
    for (let i = 1; i < 8; i++) {
        //top
        if (rook.position.y + i > 7) {
            break;
        }
        const destination = new Position(rook.position.x, rook.position.y + i);
        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpp(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        //bottom
        if (rook.position.y - i < 0) {
            break;
        }
        const destination = new Position(rook.position.x, rook.position.y - i);
        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpp(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        //left
        if (rook.position.x - i < 0) {
            break;
        }
        const destination = new Position(rook.position.x - i, rook.position.y);
        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpp(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }
    for (let i = 1; i < 8; i++) {
        // right
        if (rook.position.x + i > 7) {
            break;
        }
        const destination = new Position(rook.position.x + i, rook.position.y);
        if (!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if (tileIsOccupiedByOpp(destination, boardState, rook.team)) {
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }
    return possibleMoves;
}