"""
Paso 3 de la guía: API Gateway básico en HOST A.

En este punto el Gateway solo hace de "proxy": recibe la solicitud del
cliente y la reenvía al backend, sin validar ningún token todavía (eso
llega en el Paso 9, fuera del alcance de esta entrega que llega hasta el
Paso 6). Sirve para demostrar la PRIMERA capa de routing:

    Cliente -> API Gateway -> Backend API
"""

from fastapi import FastAPI
import httpx

app = FastAPI(title="Local API Gateway")

BACKEND_URL = "http://192.168.1.20:9000"


@app.get("/api/products")
async def products():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/products")

    return response.json()


@app.get("/api/orders")
async def orders():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BACKEND_URL}/orders")

    return response.json()
