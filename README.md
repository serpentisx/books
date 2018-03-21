# Hópverkefni 1

## Upplýsingar um hvernig setja skal setja upp verkefnið

Búa skal til gagnagrunn með því að keyra schema.sql skránna.
Til þess að koma öllum upplýingum inn í gagnagrunninn þarf svo að keyra createdb.js skránna.

## Dæmi um köll í vefþjónustu

* `POST` á `/register` með 
```json
{
  "username": "notandi",
  "name": "Notandi Jónsson",
  "password": "123" 
}
```
býr til notandann og skilar
```json
{
    "username": "notandi",
    "name": "Notandi Jónsson"
}
```

* `POST` á `/login` með 
```json
{
  "username": "notandi",
  "password": "123" 
}
```
skráir notndan inn og skilar token, t.d.:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTIxNjQxMTgwLCJleHAiOjE1Mjc2NDExODB9.QuMUvXci1uyAQS8pv9uoci_K8x7130UWgt6nY7OUi0E"
}
```

* `GET` á `/users` þegar notandi er innskráður skilar lista af notendum, hægt er að tilgreina limit og offset í query streng. Til dæmis `/users?limit=2&offset=1`

* `GET` á `/users/:id` þegar notandi er innskráður skilar upplýsingum um þann notanda sem hefur það id sem er tilgreint.

* `GET` á `/users/me` þegar notandi er innskráður skilar upplýsingum um notandann sem er nú þegar innskráður.

* `PATCH` á `/users/me` þegar notandi er innskráður með 
```json
{
    "name": "Notandi Sigurðarson",
    "password": "123"
}
```
uppfærir upplýsingar um notanda og skilar notandaupplýsingum.

* `PATCH` á `/users/me/profile` ..................................................

* `GET` á `/categories` sýnir alla flokka.

* `POST` á `/categories` með
```json
{
    "category": "Christmas stories"
}
```
býr til flokkinn Christmas stories og skilar honum.



## Nöfn og notendanöfn allra í hóp

\- [Bjarki Viðar Kristjánsson](https://github.com/bjarkivk/), bvk1@hi.is <br>
\- [Huy Van Nguyen](https://github.com/serpentisx/), hvn1@hi.is
