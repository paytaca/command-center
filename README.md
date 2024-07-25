
![Logo](https://www.paytaca.com/_nuxt/paytaca_light.11fed42b.png)


# Paytaca Command Center

This program is a project developed by Computer Science students from UP Tacloban College under their Internship Program at Paytaca. The program is a command center for displaying various information regarding the Paytaca app such as a dashboard, map, and data.


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Tech Stack

**Front-end:** Javascript, Vue, Quasar

**Back-end:** Python, Django
## Dependencies

Run the following commands in the terminal to install dependencies:
```bash
npm install
pip install -r requirements.txt
```
## Deployment

*To deploy the app, first ensure that the dependencies are properly installed.*

1. Running the Django server (`dir:/command_center_backend/`):
```bash
python manage.py runserver
```

2. Running the listeners (`dir:/command_center_backend/`):

- MQTT listener for Transactions:
    ```bash
    python manage.py mqtt_transactions
    ```
- Watchtower listener for Merchant list:
    ```bash
    python manage.py update_merchants
    ```

3. Running the Quasar app (`dir:/root`):
```bash
quasar dev
```

## Authors

- [@kqyannn](https://www.github.com/kqyannn)
- [@aaflores7](https://www.github.com/aaflores7)
- [@essiervo](https://github.com/essiervo)

