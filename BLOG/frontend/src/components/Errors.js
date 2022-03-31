

const Errors = (props) => {
    const { errors } = props
    if (errors) {
        return (
            <ul className="regist_errorList">
                {
                    Object.keys(errors).map(key => {
                        return (
                            <li key={key} className="regist_errorItem">
                                {key}:{errors[key]}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
    else {
        return null
    }

}
export default Errors