import { getCastlingMoves, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../referee/rules";
import { PieceType, TeamType } from "../Types";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
    pieces: Piece[];
    totalTurns: number;
    winningTeam?: TeamType;

    constructor(pieces: Piece[], totalTurns: number) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }
    get currentTeam(): TeamType {
        return this.totalTurns % 2 === 0 ? TeamType.OPPONENT : TeamType.OUR;
    }
    calcAllMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }

        for (const king of this.pieces.filter(p => p.isKing)) {
            if (king.possibleMoves === undefined) continue
            king.possibleMoves = [...king.possibleMoves, ...getCastlingMoves(king, this.pieces)];
        }

        this.checkCurrentTeamMoves();

        for (const piece of this.pieces.filter(p => p.team !== this.currentTeam)) {
            piece.possibleMoves = [];
        }
        const possibleMoves = this.pieces.filter(p => p.team === this.currentTeam).map(p => p.possibleMoves);


        if (this.pieces.filter(p => p.team === this.currentTeam).some(p => p.possibleMoves !== undefined && p.possibleMoves.length > 0)) {
            return;
        }
        this.winningTeam = (this.currentTeam === TeamType.OUR) ? TeamType.OPPONENT : TeamType.OUR;
    }
    checkCurrentTeamMoves() {

        for (const piece of this.pieces.filter(p => p.team === this.currentTeam)) {
            if (piece.possibleMoves === undefined) {
                continue;
            }
            for (const move of piece.possibleMoves) {
                const simBoard = this.clone();


                simBoard.pieces = simBoard.pieces.filter(p => !p.samePosition(move));


                const clonedPiece = simBoard.pieces.find(p => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();

                const clonedKing = simBoard.pieces.find(p => p.isKing && p.team === simBoard.currentTeam)!;
                for (const enemy of simBoard.pieces.filter(p => p.team !== simBoard.currentTeam)) {
                    enemy.possibleMoves = simBoard.getValidMoves(enemy, simBoard.pieces);

                    if (enemy.isPawn) {
                        if (enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move));
                        }
                    } else {
                        if (enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move));
                        }
                    }



                }


            }
        }
    }
    getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }
    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position): boolean {
        const pawnDirection = (playedPiece.team === TeamType.OUR) ? 1 : -1;
        const destPiece = this.pieces.find(p => p.samePosition(destination));

        if (playedPiece.isKing && destPiece?.isRook && destPiece.team === playedPiece.team) {
            const direction = (destPiece.position.x - playedPiece.position.x > 0) ? 1 : -1;
            const newKingXPos = playedPiece.position.x + direction * 2;
            this.pieces = this.pieces.map(p => {
                if (p.samePiecePosition(playedPiece)) {
                    p.position.x = newKingXPos;
                } else if (p.samePiecePosition(destPiece)) {
                    p.position.x = newKingXPos - direction;
                }
                return p;
            });

            this.calcAllMoves();
            return true;
        }


        if (enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
                    results.push(piece);
                } else if (!piece.samePosition(new Position(destination.x, destination.y - pawnDirection))) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])
            this.calcAllMoves();
        } else if (validMove) {

            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(playedPiece)) {

                    if (piece.isPawn) {
                        (piece as Pawn).enPassant =
                            Math.abs(playedPiece.position.y - destination.y) === 2 &&
                            piece.type === PieceType.PAWN;
                    }

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;


                    results.push(piece);
                } else if (!piece.samePosition(destination)) {
                    if (piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);
            this.calcAllMoves();

        } else {
            return false;
        }
        return true;
    }
    clone(): Board {

        return new Board(this.pieces.map(p => p.clone()), this.totalTurns);

    }
}
