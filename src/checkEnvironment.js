export default function checkEnvironment() {
    if(!wx || !App || !Page || !getApp) {
	return false
    }

    return true
}
