const express = require('express');
const router = express.Router();
const pg = require('pg');

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Movie Game',
  password: 'hary22',
  port: 5432,
})

const getMovies = (req, res) => {
  pool.query('SELECT * FROM movie_title ORDER BY player_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getLeaderBoard = (req, res) => {
  pool.query('SELECT * FROM LeaderBoard ORDER BY player_id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
};

const getLeaderBoardByName = (req, res) => {
  const name = req.params.name;
  
  pool.query('SELECT * FROM LeaderBoard where player_id = $1 limit 1', [name], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows[0]);
  })
  
};

const addPlayerScore = (req, res) => {
  const { name, score } = req.body

  pool.query('INSERT INTO LeaderBoard (player_id, score) VALUES ($1, $2) RETURNING *', [name, score], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(results.rows[0]);
  })
};

const checkAttempt = (req, res) => {
  const { movie_name, player_name, selected_release_year} = req.body;

  pool.query('SELECT * FROM movie_itle where player_id = $1 limit 1', [movie_name], (error, results) => {
    if (error) {
      throw error;
    }
    const movie_details = results.rows[0];
    if (movie_details?.release_year == selected_release_year) {
      pool.query('SELECT * FROM LeaderBoard where player_id = $1 limit 1', [player_name], (error, results1) => {
        if (error) {
          throw error;
        }
        const player_details = results1.rows[0];
        pool.query('update LeaderBoard set score = $1 where player_id = $2', [player_details.score + 1, player_name], (error, results2) => {
          if (error) {
            throw error;
          }
          res.status(201).json({
            message: "Correct choice."
          });
        })
      })
    } else {
      res.status(201).json({
        message: "Incorrect choice."
      });
    }
  })
}

router.get('/movies', getMovies);
router.get('/leaderboard', getLeaderBoard);
router.get('/leaderboard/:name', getLeaderBoardByName);
router.post('/leaderboard', addPlayerScore);
router.post('/checkAttempt', checkAttempt);

module.exports = router;
