<?php

namespace Acme\Model;

use Illuminate\Database\Eloquent\Model;

/**TS BASE MODEL FOR REUSABLE QUERY FUNCTIONS**/
class BaseModel extends Model
{

	private $page;
    private $page_size;
    private $is_infinite;
    private $num_rows;


    /*add an array of filters
    * @data = Model
    * @params = list of filters
    * @order_by = array for order by list
	* EX:   $data = $this->_add_filter($data, 'name', $input);
    */
	public function _add_filters($data, $params = array(), $order_by = array()) {
        if(is_array($params)){
            foreach($params as $key=> $value){
                $data = $this->_filter($data, $key, $value);
            }
        }
        //added parameter to order results properly
        if(is_array($order_by)){
            foreach($order_by as $key=> $value){
                //manual hack to avoid ambiguous fields
                $key = str_replace('---', '.', $key);
                $data = $data->orderBy($key, $value);
            }
        }
        return $data;
    }

    /*add one filter only if @input_params has the @param_name
    * @data = Model
    * @param_name = param to be filtered
    * @input_params = input from user
	* EX:   $data = $this->_add_filter($data, 'name', $input);
    */
    public function _add_filter($data, $param_name, $input_params) {
        if (isset($input_params[$param_name])) {
            $data = $this->_filter($data, $param_name, $input_params[$param_name]);
        }
        return $data;
    }

    /*Clean up input from pagination params
    * @input = input from user
    * returns cleaned input array
    */
    public function _construct_pagination_params($input) {
        $pagination_params = array('page' => '', 'page_size' => '', 'is_infinite' => 'false');
        foreach ($pagination_params as $key => $value) {
            if (isset($input[$key])) {
                $this->$key = $input[$key];
                unset($input[$key]);
            }
        }
        return $input;
    }

    /* Reusable method for filtering 1 value 
    * @data = model
    * @key = field name
    * @value = value to be filtered
    */
    public function _filter($data, $key, $value) {
        $key = str_replace('---', '.', $key);
        $key = str_replace('_LK', ' LIKE', $key);
        $key = str_replace('_NE', ' !=', $key);
        $key = str_replace('_GT', ' >', $key);
        $key = str_replace('_LT', ' <', $key);
        $key = str_replace('_GE', ' >=', $key);
        $key = str_replace('_LE', ' <=', $key);
        $item = explode(" ", $key);
        if (count($item) > 1) {
            if (trim($item[1]) == 'LIKE') { 
                $value = $value.'%'; 
            }
            $data = $data->where($item[0], $item[1], $value);
        } else {
            $data = $data->where($item[0], $value);
        }
        return $data;
    }

    /**
    return an array with list and pagination objects
    */
    public function _paginate($data, $request, $input = array())
    {
        if (!empty($input)) {
            $input = $this->_construct_pagination_params($input);
            $data = $this->_add_filters($data, $input);
        }
        
        $num_rows = $data->count();
        $links = array();


        if($this->page_size!=null && $this->page!=null) {
            $this->num_rows = $num_rows;
            $links_count = 3;
            $query_string = $_SERVER['QUERY_STRING'];
            $query_string = explode('&',$query_string);
            $pointer = 0;
            foreach($query_string as $segment)
            {
                $key_value = explode('=',$segment);
                if($key_value[0]=='page')
                {
                    break;
                }
                $pointer = $pointer +1;
            }
            unset($query_string[$pointer]);

            $links = array();
            $links['special'] = array();
            $links['pages'] = array();
            $before_link_count = $this->page - $this->get_before();
            if($this->page>1)
            {
                $links['special']['first'] = $this->current_url($request).'?'.implode('&',$query_string)."&page=1";
                $links['special']['back'] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".($this->page-1);
            }
            
            if($num_rows>$this->page_size)
            {
                $tempcount = 0;
                for ($x=$before_link_count-1; $x<$this->page; $x++) 
                {
                    if(($this->page - $x) < $links_count+1)
                    {
                        $page = $x;
                        //edit karlob
                        $links['pages'][$page] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".$page;
                    }
                    else
                    {
                        continue;
                    }
                }
            }

            //edit karlob
            $active_page = $this->page;
            $links['pages'][$active_page] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".$_GET['page'];
            $count = $this->page;
            $tempcount = 0;
            for ($x=$count; $x<ceil($num_rows / $this->page_size); $x++) 
            {
                $page = $x + 1;
                $links['pages'][$page] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".$page;
                $tempcount = $tempcount + 1;
                if($tempcount == $links_count) { break; }
            }
            $last_page = $this->get_last_page();
            if($active_page!=$last_page&&$num_rows>$this->page_size)
            {
                $links['special']['next'] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".($this->page+1);
                $links['special']['last'] = $this->current_url($request).'?'.implode('&',$query_string)."&page=".$last_page;
            }

            if($this->page_size!=null && $this->page!=null)
            {
                $data = $data->skip(($this->page-1)*$this->page_size)->take($this->page_size);
            }
            $links['num_rows'] = $num_rows;
            $links['page'] = $this->page;
            $links['last_page'] = $last_page;
            $return['pagination'] = $links;
        }
        $return['list'] = $data->get();
        // if (isset($input['skip']) && isset($input['take'])) {
        //     $data = $data->skip($input['skip'])->take($input['take']);
        // }
        return $return;
    }

    private function current_url($request){
        return $request->url();
    }

    private function get_last_page()
    {
        if($this->num_rows>$this->page_size)
        {
            return ceil($this->num_rows / $this->page_size);
        }
        else
        {
            return 0;
        }
    }

    private function get_before()
    {
        //returns the number of results that are before the current query set
        $this->page;
        $this->page_size;
        $this->num_rows;
        $belong_set = ($this->page * $this->page_size) / $this->page_size;

        if($this->page_size > $this->num_rows)
        {
            return 0;
        }
        else
        {
            return $belong_set - 2;
        }
    }



}
