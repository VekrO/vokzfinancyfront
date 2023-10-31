import { Observable } from "rxjs";
import { Usuario } from "src/app/models/Usuario.model";

export interface IUsuarioService {
    get: (id: number) => Observable<Usuario>;
    put: (dados: Usuario) => Observable<Usuario>;
    patch: (dados: Usuario) => Observable<Usuario>;
    getSaldoByIdUsuarioAsync: (idUsuario: number) => Observable<number>;
    getSaldoByIdUsuarioAndIdContaAsync: (idUsuario: number, idConta: number) => Observable<number>;
    getValorReceitasByIdUsuarioAsync: (idUsuario: number, dtIni: string, dtFim: string) => Observable<number>;
    getValorDespesasByIdUsuarioAsync: (idUsuario: number, dtIni: string, dtFim: string) => Observable<number>;
    getValorReceitasByIdUsuarioAndIdContaAsync: (idUsuario: number, idConta: number, dtIni: string, dtFim: string) => Observable<number>;
    getValorDespesasByIdUsuarioAndIdContaAsync: (idUsuario: number, idConta: number, dtIni: string, dtFim: string) => Observable<number>;
}
