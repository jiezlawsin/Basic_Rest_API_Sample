<?php

namespace App;

use Acme\Model\BaseModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;  

class Persons extends BaseModel
{
    use SoftDeletes;

    protected $fillable = [
    	'name',
    	];

}
