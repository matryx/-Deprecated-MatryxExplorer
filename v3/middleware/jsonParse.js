module.exports = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body)
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid JSON string'
    })
  }
  next()
}
