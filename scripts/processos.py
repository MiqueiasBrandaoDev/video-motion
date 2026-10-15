"""Lista e encerra, POR PID, só os processos que esta execução abriu (Remotion, Chrome headless, Playwright).

Regra: nunca encerrar por nome (taskkill /IM, pkill, killall). Isso derruba o navegador
e os apps do usuário. Este script:
  --listar            mostra processos de automação: linha de comando com remotion,
                      chrome-headless-shell ou ms-playwright, ou navegador (chrome,
                      chromium, msedge) com --headless, --remote-debugging-port ou
                      --print-to-pdf; com PID e memória
  --encerrar PID ...  encerra SÓ os PIDs informados, e só se a linha de comando
                      deles tiver uma dessas marcas (recusa o resto)
Use --listar antes de abrir o studio/render e depois de terminar: encerre apenas os
PIDs novos, que são os seus.

Lista pelo psutil quando ele existe (sem WMI); senão, no Windows, pelo Get-CimInstance com
limite de 90 s. psutil instalado só no site do usuário: rode com python -E -P.

Uso:
  python -I scripts/processos.py --listar
  python -I scripts/processos.py --encerrar 12345 12388
"""
import argparse
import json
import os
import signal
import subprocess
import sys

# marca forte: basta aparecer na linha de comando
FORTES = ["remotion", "chrome-headless-shell", "ms-playwright"]
# flags de navegador automatizado: só contam se o executável for um navegador
FLAGS_NAVEGADOR = ["--headless", "--remote-debugging-port", "--print-to-pdf", "--disable-field-trial-config"]
NAVEGADORES = ["chrome", "chromium", "msedge", "headless_shell"]


def processos():
    try:  # psutil não passa pelo WMI (no Windows o Get-CimInstance trava junto com o serviço WMI)
        import psutil
        out = []
        for p in psutil.process_iter(["pid", "name", "cmdline", "memory_info"]):
            try:
                cmd = " ".join(p.info["cmdline"] or []) or (p.info["name"] or "")
                mem = p.info["memory_info"].rss if p.info["memory_info"] else 0
                out.append((p.info["pid"], p.info["name"] or "", cmd, mem))
            except (psutil.Error, OSError):
                continue
        return out
    except ImportError:
        pass
    if os.name == "nt":
        ps = ("Get-CimInstance Win32_Process | Select-Object ProcessId,Name,CommandLine,WorkingSetSize | "
              "ConvertTo-Json -Compress")
        try:
            r = subprocess.run(["powershell", "-NoProfile", "-Command", ps], capture_output=True, text=True, encoding="utf-8",
                               errors="ignore", timeout=90)
        except subprocess.TimeoutExpired:
            sys.exit("a consulta ao WMI (Get-CimInstance) passou de 90 s: o serviço WMI está travado. Instale o psutil "
                     "(pip install psutil) e rode com python -E -P, que lista sem passar pelo WMI.")
        dados = json.loads(r.stdout or "[]")
        if isinstance(dados, dict):
            dados = [dados]
        return [(int(d["ProcessId"]), d.get("Name") or "", d.get("CommandLine") or "", int(d.get("WorkingSetSize") or 0)) for d in dados]
    r = subprocess.run(["ps", "-axo", "pid=,rss=,comm=,args="], capture_output=True, text=True)
    out = []
    for linha in r.stdout.splitlines():
        partes = linha.split(None, 3)
        if len(partes) >= 3:
            pid, rss, nome = partes[0], partes[1], partes[2]
            out.append((int(pid), nome, partes[3] if len(partes) > 3 else nome, int(rss) * 1024))
    return out


def eh_automacao(nome, cmd):
    c, n = cmd.lower(), nome.lower()
    if any(m in c for m in FORTES):
        return True
    return any(b in n for b in NAVEGADORES) and any(f in c for f in FLAGS_NAVEGADOR)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Lista/encerra por PID apenas processos de automação (Remotion, headless, Playwright).")
    ap.add_argument("--listar", action="store_true")
    ap.add_argument("--encerrar", nargs="+", type=int, metavar="PID")
    a = ap.parse_args()
    if not a.listar and not a.encerrar:
        ap.print_help()
        return
    tabela = {pid: (nome, cmd, mem) for pid, nome, cmd, mem in processos()}
    eu = os.getpid()
    if a.listar:
        achados = [(pid, n, c, m) for pid, (n, c, m) in tabela.items() if pid != eu and eh_automacao(n, c) and "processos.py" not in c]
        for pid, n, c, m in sorted(achados):
            print(f"{pid:7d} {m / 1e6:7.1f} MB  {n:24} {c[:140]}")
        print(f"{len(achados)} processo(s) de automação, {sum(x[3] for x in achados) / 1e6:.0f} MB")
    if a.encerrar:
        liberado, n = 0, 0
        for pid in a.encerrar:
            if pid not in tabela:
                print(f"{pid}: não existe mais")
                continue
            nome, cmd, mem = tabela[pid]
            if not eh_automacao(nome, cmd):
                print(f"{pid}: RECUSADO, não é processo de automação ({nome}). Não encerro processo do usuário.")
                continue
            try:
                if os.name == "nt":
                    subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], capture_output=True)
                else:
                    os.kill(pid, signal.SIGTERM)
                n += 1
                liberado += mem
                print(f"{pid}: encerrado ({nome}, {mem / 1e6:.0f} MB)")
            except OSError as e:
                print(f"{pid}: falhou ({e})")
        print(f"{n} encerrado(s), ~{liberado / 1e6:.0f} MB liberados")


if __name__ == "__main__":
    main()
