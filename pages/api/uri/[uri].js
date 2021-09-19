import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const { uri } = req.query

  const { data, error } = await supabase
    .from('json')
    .select('data')
    .match({uri: uri})

  res.status(200).json(data[0].data)
}
