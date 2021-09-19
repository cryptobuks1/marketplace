import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const { SUPABASE_URL, SUPABASE_KEY } = process.env
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  const { data, error } = await supabase
    .from('json')
    .select('*')

  res.status(200).json(data)
}
