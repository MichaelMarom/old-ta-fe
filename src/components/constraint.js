const containerVariants = {
    hidden: {
        x: "-100vw"
    },
    visible: {
        x: 0,
        transition: {
            duration: .1
        }
    },
    exit: {
        x: "-100vw",
        transition: {
            duration: .1
        }
    }
}

export default containerVariants;