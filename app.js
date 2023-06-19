const express = require('express');
const bodyParser = require("body-parser");
const { FilterRadius } = require('./controllers/FilterRadius');
const conn = require('./db').promise();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.post('/', async (req, res) => {

    
    console.log(req.body)

    const categories = req.body.categories;
    const price = req.body.price;
    const time = req.body.time;

    const latPerson = Number(req.body.lat);
    const lonPerson = Number(req.body.lon);

    // Создаем массив параметров для оператора IN
    const params = categories.map(() => '?').join(',');

    // Создаем динамический SQL-запрос с использованием параметров
    const query = `SELECT * FROM Points WHERE price <= ? AND time <= ? AND category IN (${params})`;

    // Создаем массив параметров, включая price, time и категории
    const queryParams = [price, time, ...categories];

    // Выполняем запрос с передачей массива параметров
    const [points] = await conn.execute(query, queryParams);

    // Массив для хранения результатов выборки
    const randomPoints = [];


    // Перебираем каждую категорию и выбираем случайную точку из каждой категории
    categories.forEach(category => {
    
    // Фильтруем результаты по текущей категории
    const categoryPoints = points.filter(point => point.category === category);

    // Если есть точки для данной категории
    if (categoryPoints.length > 0) {
        
        // Фильтруем точки по радиусу 
        const radiusFilter = categoryPoints.filter(point => FilterRadius(point.latitude, point.longitude, latPerson, lonPerson) <= 4)
       
        // Если есть точки для данной категории
        if (radiusFilter.length > 0) {
            // Генерируем случайный индекс для выбора случайной точки
            const randomIndex = Math.floor(Math.random() * radiusFilter.length);

            // Выбираем случайную точку и добавляем ее в массив результатов
            randomPoints.push(radiusFilter[randomIndex]);
        }
    }
    });

    res.send(JSON.stringify(randomPoints))
    
})




app.listen(3000, '127.0.0.1', () => console.log('Server is running on port 3000'));