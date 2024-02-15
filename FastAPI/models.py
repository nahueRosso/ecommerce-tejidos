from database import Base
from sqlalchemy import Column, Integer, String,Boolean,Float


class Producto(Base):
    __tablename__ = 'producto'
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    category = Column(String)
    description = Column(String)
    es_ingreso = Column(Boolean)
    precio_nuevo = Column(Float)
    precio_viejo = Column(Float)
    codigo_de_barra = Column(String)


class Imagen(Base):
    __tablename__ = 'imagen'
    
    id = Column(Integer, primary_key=True,index=True)
    imagen_data = Column(String)
    orden = Column(Integer)
    codigo_de_barra = Column(String)
    