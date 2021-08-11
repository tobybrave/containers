const notificationReducer = (state=null, action) => {
  switch (action.type) {
    case 'ALERT':
      return action.data
    case 'REMOVE':
      return action.data
    default: return state
  }
}

export const notifier = (message) => {
  return async (dispatch) => {
    dispatch({
      type: 'ALERT',
      data: {
        message,
        success: true
      }
    })
    dispatch(removeNotifier())
  }
}

export const errorNotifier = (message) => {
  return async (dispatch) => {
    dispatch({
      type: 'ALERT',
      data: {
        message,
        success: false
      }
    })
    dispatch(removeNotifier())
  }
}

let timeID

export const removeNotifier = () =>{
  return async (dispatch) => {
  clearTimeout(timeID)
  
  timeID = setTimeout(() => {
    dispatch({
      type: 'REMOVE',
      data: null
    })
  }, 6000)
  }
} 

export default notificationReducer
