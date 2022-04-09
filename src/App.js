import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:4000'

const TransactionTable = ({data}) => {
  return data.map((item) => {
    return (
      <tr>
        <td>{item.id}</td>
        <td>{item.companyName}</td>
        <td>{item.productName}</td>
        <td>{item.productPrice}</td>
        <td>{item.amount}</td>
        <td>{item.totalPrice}</td>
        <td>{item.createdAt}</td>
      </tr>
    )
  })
}

const CompanyTable = ({data}) => {
  return data.map((item) => {
    return (
      <tr>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.code}</td>
      </tr>
    )
  })
}

const OptionList = ({data}) => {
  return data.map((item, index) => {
    return (
      <option value={item.id} selected={index === 0}>{item.name}</option>
    )
  })
}

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username:'',
    password: '',
  })
  const [companyForm, setCompanyForm] = useState({
    name:'',
    code: '',
  })
  const [transactionForm, setTransactionForm] = useState({
    companyId:'',
    productId: '',
    amount: '',
  })
  const [activeMenu, setActiveMenu] = useState(1)
  const [companyList, setCompanyList] = useState([])
  const [transactionList, setTransactionList] = useState([])
  const [productList, setProductList] = useState([])

  useEffect(()=> {
    const auth = localStorage.getItem('auth')
    fetchCompany()
    fetchTransaction()
    fetchProduct()
    if(auth) setIsLogin(true)
  },[isLogin])


  const onLoginClick = async () => {
    try {
      setIsLoading(true)
      const result = await axios.post(`${BASE_URL}/user/login`,{
        username: loginForm.username,
        password: loginForm.password,
      })
      localStorage.setItem('auth', JSON.stringify(result.data))
      setIsLoading(false)
      setIsLogin(true)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const fetchCompany = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${BASE_URL}/company`)
      setIsLoading(false)
      setCompanyList(result.data.data)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${BASE_URL}/product`)
      setIsLoading(false)
      setProductList(result.data.data)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const fetchTransaction = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(`${BASE_URL}/transaction`)
      setIsLoading(false)
      setTransactionList(result.data.data)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const fetchCreateCompany = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${BASE_URL}/company`, {
        name: companyForm.name,
        code: companyForm.code,
      })
      setCompanyForm({
        name:'',
        code: ''
      })
      fetchCompany()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }
  const fetchCreateTransaction = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${BASE_URL}/transaction`, {
        productId: transactionForm.productId,
        companyId: transactionForm.companyId,
        amount: transactionForm.amount,
      })
       setTransactionForm({
        companyId:'',
        productId: '',
        amount: ''
      })
      fetchTransaction()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  if(isLoading) {
    return <div>loading...</div>
  }
  return (
    <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{border: '1px solid black', height: '50%', minWidth: '20%', marginTop: '10%', padding: '5%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        {!isLogin?
      (  <>
          <h4>Login</h4>
          <label for="fname">username:</label>
          <input type="text" value={loginForm.username} id="fname" name="fname" onChange={(event)=>setLoginForm({...loginForm, username: event.target.value})}/>
          <label for="lname">password:</label>
          <input type="password"  value={loginForm.password} id="lname" name="lname" onChange={(event)=>setLoginForm({...loginForm, password: event.target.value})}/>
          <input type="button" value="submit" style={{marginTop: '8%'}} onClick={onLoginClick}/>
        </>
      )
      :
      (
        <>
        <div>login sukses!</div>
        <div>
          <div style={{display: 'flex'}}>
            <div onClick={()=>setActiveMenu(1)} style={{border: '1px solid black', padding: '2px', marginRight: '3%', alignItems: 'center', textAlign: 'center', cursor: 'pointer'}}>Company</div>
            <div onClick={()=>setActiveMenu(2)} style={{border: '1px solid black', padding: '2px', marginRight: '3%', alignItems: 'center', textAlign: 'center', cursor: 'pointer'}}>Transaction</div>
            <div onClick={()=>window.open(`${BASE_URL}/transaction/print`, '_blank')} style={{border: '1px solid black', padding: '2px', marginRight: '3%', alignItems: 'center', textAlign: 'center', cursor: 'pointer'}}>Export Transaction</div>
          </div>
          {
            activeMenu === 1 && (
              <div>
                <div>List of company</div>
                <table>
                  <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>code</th>
                  </tr>
                  <CompanyTable data={companyList} />
                </table>
                <div style={{marginTop: '10%', display: 'flex', flexDirection: 'column'}}>
                  <label for="fname">company name:</label>
                  <input type="text" value={companyForm.name} id="fname" name="fname" onChange={(event)=>setCompanyForm({...companyForm, name: event.target.value})}/>
                  <label for="lname">company code:</label>
                  <input type="text"  value={companyForm.code} id="lname" name="lname" onChange={(event)=>setCompanyForm({...companyForm, code: event.target.value})}/>
                  <input type="button" value="submit" style={{marginTop: '8%'}} onClick={fetchCreateCompany}/>
                </div>
              </div>
            )
          }
          {
            activeMenu === 2 && (
              <div>
                <div>List of transaction</div>
                <table>
                  <tr>
                    <th>id</th>
                    <th>company name</th>
                    <th>product name</th>
                    <th>price</th>
                    <th>amount</th>
                    <th>total price</th>
                    <th>created at</th>
                  </tr>
                  <TransactionTable data={transactionList} />
                </table>
                 <div style={{marginTop: '10%', display: 'flex', flexDirection: 'column'}}>
                  <label for="fname">company name:</label>
                  <select defaultValue={transactionForm.companyId} onChange={(event)=>setTransactionForm({...transactionForm, companyId: event.target.value})}>
                    <OptionList data={companyList}/>
                  </select>
                  <label for="lname">product:</label>
                  <select defaultValue={transactionForm.productId} onChange={(event)=>setTransactionForm({...transactionForm, productId: event.target.value})}>
                    <OptionList data={productList}/>
                  </select>
                  <label for="lname">amount</label>
                  <input type="number"  defaultValue={transactionForm.amount} id="lname" name="lname" onChange={(event)=>setTransactionForm({...transactionForm, amount: event.target.value})}/>
                  <input type="button" value="submit" style={{marginTop: '8%'}} onClick={fetchCreateTransaction}/>
                </div>
              </div>
            )
          }
          {
            activeMenu === 3 && (
              <div>Export Transaction</div>
            )
          }

        </div>

        </>
      )
      }
      </div>
    </div>
  );
}

export default App;
