CREATE  TABLE Grupe
( 
     Cod_grupa NUMBER(10) NOT NULL ,
     Seria VARCHAR2(10) NOT NULL ,
     An_studiu NUMBER(10) NULL      ,
     CONSTRAINT PK_Grupe PRIMARY KEY (Cod_grupa) NOT DEFERRABLE Initially IMMEDIATE
     USING INDEX
     PCTFREE 10
     INITRANS 2
     MAXTRANS 255
     STORAGE
     (
       INITIAL 64K
       NEXT 0K
       MINEXTENTS 1
       MAXEXTENTS 2147483645
       PCTINCREASE 0
     )
)
     PCTFREE 10
     PCTUSED 40
     INITRANS 1
     MAXTRANS 255
     STORAGE
     (
       INITIAL 64K
       NEXT 0K
       MINEXTENTS 1
       MAXEXTENTS 2147483645
       PCTINCREASE 0
     )
/

CREATE  TABLE Comp_grupe
( 
     Cod_grupa NUMBER(10) NOT NULL ,
     Seria VARCHAR2(10) NOT NULL ,
     Matricol NUMBER(10) NOT NULL ,
     An_univ NUMBER(10) NULL ,
     An_studiu NUMBER(1) NULL ,
     Nume_stud VARCHAR2(30) NULL ,
     Restantier VARCHAR2(1) NULL ,
     Obs VARCHAR2(300) NULL ,
     Id_comp NUMBER(10) NOT NULL      ,
     CONSTRAINT PK_Comp_grupe PRIMARY KEY (Id_comp,Cod_grupa) NOT DEFERRABLE Initially IMMEDIATE
     USING INDEX
     PCTFREE 10
     INITRANS 2
     MAXTRANS 255
     STORAGE
     (
       INITIAL 64K
       NEXT 0K
       MINEXTENTS 1
       MAXEXTENTS 2147483645
       PCTINCREASE 0
     )
)
     PCTFREE 10
     PCTUSED 40
     INITRANS 1
     MAXTRANS 255
     STORAGE
     (
       INITIAL 64K
       NEXT 0K
       MINEXTENTS 1
       MAXEXTENTS 2147483645
       PCTINCREASE 0
     )
/

ALTER TABLE Comp_grupe ADD
(
     CONSTRAINT Relation_201 FOREIGN KEY
     ( Cod_grupa )
     REFERENCES Grupe
     ( Cod_grupa )
     NOT DEFERRABLE Initially IMMEDIATE
)
/

