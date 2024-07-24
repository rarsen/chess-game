import { useEffect, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import Chessboard from "../chessboard/Chessboard";
import { bishopMove, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../referee/rules";
import { Piece, Position } from "../../models";
import { PieceType, TeamType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Board } from "../../models/Board";



export default function Referee() {
    const [board, setBoard] = useState<Board>(initialBoard.clone());
    const [promotionPawn, setpromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkMateModalRef = useRef<HTMLDivElement>(null);

    


    function playMove(playedPiece: Piece, destination: Position): boolean {

        if (playedPiece.possibleMoves === undefined) return false;

        if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) {
            return false;
        }
        if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) {
            return false;
        }
        let playedMoveIsValid = false;

        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if (!validMove) return false;
        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);

            if (clonedBoard.winningTeam!==undefined) {
                checkMateModalRef.current?.classList.remove("hidden");
            }
            return clonedBoard;
        })


        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setpromotionPawn((previousPromoPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }


        return playedMoveIsValid;
    }
    function isEnPassantMove(innitialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        if (type === PieceType.PAWN) {
            if ((desiredPosition.x - innitialPosition.x === -1 || desiredPosition.x - innitialPosition.x === 1) && desiredPosition.y - innitialPosition.y === pawnDirection) {
                const piece = board.pieces.find(
                    (p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.isPawn && (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }

            }
        }
        return false;
    }

    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);

        }
        return validMove;
    }


    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team,true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            clonedBoard.calcAllMoves();

            return clonedBoard;
        });


        modalRef.current?.classList.add("hidden");
    }
    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }


    function restartGame(){
        checkMateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }
    return (
        <>
            <p style={{ color: "white", fontSize: "24px", textAlign:"center" }}>Total turns: {board.totalTurns}</p>
            <div className="modal hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assests/images/rook_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assests/images/bishop_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assests/images/knight_${promotionTeamType()}.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assests/images/queen_${promotionTeamType()}.png`} />
                </div>
            </div>
            <div className="modal hidden" ref={checkMateModalRef}>
                <div className="modal-body">
                    <div className="checkmate-body">
                        <span>The winnng team is {board.winningTeam ===TeamType.OUR?"white":"black"}!</span>
                        <button onClick={restartGame}>Play again</button>
                    </div>
                    
                </div>
            </div>
            <Chessboard playMove={playMove} pieces={board.pieces} />
        </>
    )
}