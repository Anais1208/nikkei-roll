"""
Paso 2 de la guía: API REST "normal" en HOST B, sin ningún tipo de
protección todavía. Sirve para demostrar el ANTES: en este punto cualquiera
que sepa la IP y el puerto puede llamar directamente a /products y /orders.

Esta versión queda reemplazada por backend_api.py (Paso 6), que sí exige
una credencial interna del Gateway. Se deja aquí como evidencia del
progreso paso a paso pedido en la guía.
"""

from fastapi import FastAPI

app = FastAPI(
    title="Backend API",
    description="API ubicada en un host diferente al API Gateway",
)


@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "Backend API",
    }


@app.get("/products")
def products():
    return {
        "products": [
            {"id": 1, "name": "Notebook", "price": 900000},
            {"id": 2, "name": "Monitor", "price": 250000},
        ]
    }


@app.get("/orders")
def orders():
    return {
        "orders": [
            {"id": 1001, "status": "paid"},
            {"id": 1002, "status": "pending"},
        ]
    }
