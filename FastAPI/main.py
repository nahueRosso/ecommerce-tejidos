from typing import Annotated, List
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine
import models

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImagenBase(BaseModel):
    imagen_data:str
    orden:int
    codigo_de_barra:str


class ImagenModel(ImagenBase):
    id: int

    class Config:
        orm_mode = True

class ProductoBase(BaseModel):
    titulo: str
    category: str
    description: str
    es_ingreso: bool
    precio_nuevo: float
    precio_viejo: float
    codigo_de_barra: str


class ProductoModel(ProductoBase):
    id: int

    class Config:
        orm_mode = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
DbDependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

# print(DbDependency)

@app.post('/productos/', response_model=ProductoModel)
async def create_productos(producto: ProductoBase, db: DbDependency):
    db_producto = models.Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto



@app.get('/productos/', response_model=List[ProductoModel])
async def read_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    productos = db.query(models.Producto).offset(skip).limit(limit).all()
    return productos


@app.delete('/productos/{producto_id}', response_model=ProductoModel)
async def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(db_producto)
    db.commit()
    return db_producto



@app.post('/imagen/', response_model=ImagenModel)
async def create_transaction(transaction: ImagenBase, db: DbDependency):
    db_transaction = models.Imagen(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get('/imagen/',response_model=List[ImagenModel])
async def read_transactions(db:DbDependency,skip:int = 0 ,limit:int =100):
    transactions = db.query(models.Imagen).offset(skip).limit(limit).all()
    return transactions

@app.delete('/imagen/{imagen_id}', response_model=ImagenModel)
async def delete_imagen(imagen_id: int, db: Session = Depends(get_db)):
    db_imagen = db.query(models.Imagen).filter(models.Imagen.id == imagen_id).first()
    if db_imagen is None:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    db.delete(db_imagen)
    db.commit()
    return db_imagen

@app.put('/productos/{producto_id}', response_model=ProductoModel)
async def update_producto(producto_id: int, producto: ProductoBase, db: DbDependency):
    db_producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if db_producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for attr, value in producto.dict().items():
        setattr(db_producto, attr, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@app.put('/imagen/{imagen_id}', response_model=ImagenModel)
async def update_imagen(imagen_id: int, imagen: ImagenBase, db: DbDependency):
    db_imagen = db.query(models.Imagen).filter(models.Imagen.id == imagen_id).first()
    if db_imagen is None:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    for attr, value in imagen.dict().items():
        setattr(db_imagen, attr, value)
    db.commit()
    db.refresh(db_imagen)
    return db_imagen


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
